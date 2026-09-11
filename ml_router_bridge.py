from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from collections import Counter
import pandas as pd
import numpy as np
import joblib
import os

from app.database import get_db
from app.models import Project
from app.dependencies import get_current_user
from app.schemas import AnalysisOut

# Import the standalone execution module sitting natively on the branch
import compliance_checks

router = APIRouter(prefix="/api/v1/ml", tags=["Machine Learning Engine"])

def compute_row_danger_score(project: Project, linear_model) -> float:
    """Transforms active database properties into features for danger score calculation."""
    sector_str = str(project.sector).lower() if project.sector else ""
    is_road = 1 if 'road' in sector_str else 0
    is_railway = 1 if 'railway' in sector_str else 0
    is_coal = 1 if 'coal' in sector_str else 0

    cost_base = float(project.original_cost or 0)
    revised = float(project.revised_cost or cost_base)
    cost_overrun_pct = float(((revised - cost_base) / cost_base) * 100) if cost_base > 0 else 0.0
    
    delay_months = float(project.delay_months or 0)
    missing_log_count = int(getattr(project, 'missing_log_count', 0))
    material_price_surge = float(getattr(project, 'material_price_index_surge', 1.0))
    if material_price_surge <= 0:
        material_price_surge = 1.0

    land_status = str(getattr(project, 'land_site_status', 'None'))
    weather_alert = str(getattr(project, 'upcoming_weather_alert', 'Clear'))
    
    land_impact = {'None': 0.0, 'Minor Disputes': 8.5, 'Severe Court Stay': 25.0}.get(land_status, 0.0)
    weather_impact = {'Clear': 0.0, 'Heavy Monsoon Area': 7.0, 'Snow/Landslide Zone': 12.0}.get(weather_alert, 0.0)

    X_new = pd.DataFrame([[
        cost_overrun_pct, delay_months, missing_log_count,
        is_road, is_railway, is_coal, land_impact, weather_impact, material_price_surge
    ]], columns=['cost_overrun_percentage', 'delay_months', 'missing_log_count', 
                'is_road', 'is_railway', 'is_coal', 'land_impact_factor', 'weather_impact_factor', 'material_price_index_surge'])

    return np.clip(float(linear_model.predict(X_new)), 0, 100)


@router.get("/analysis/{project_id}", response_model=AnalysisOut)
def get_project_predictive_analysis(
    project_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Processes individual database row items through the 4 ML models for the project detail page."""
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project records not found in the database registry.")
    
    cost_base = float(project.original_cost or 0)
    revised = float(project.revised_cost or cost_base)
    cost_overrun_pct = float(((revised - cost_base) / cost_base) * 100) if cost_base > 0 else 0.0

    project_dict = {
        "project_id": project.project_id,
        "sector": project.sector,
        "status": project.status,
        "cost_overrun_percentage": cost_overrun_pct,
        "delay_months": float(project.delay_months or 0),
        "missing_log_count": int(getattr(project, 'missing_log_count', 0)),
        "allocated_budget_cr": float(project.allocated_budget or 0),
        "material_price_index_surge": float(getattr(project, 'material_price_index_surge', 1.0)),
        "land_site_status": str(getattr(project, 'land_site_status', 'None')),
        "upcoming_weather_alert": str(getattr(project, 'upcoming_weather_alert', 'Clear'))
    }

    return compliance_checks.process_and_score_project(project_dict)


@router.get("/dashboard/summary")
def get_dashboard_aggregates(
    ministry_name: str = "Railway",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Aggregates active rows dynamically into High, Medium, and Low risk distributions."""
    try:
        linear_model = joblib.load('danger_meter_model.pkl')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model asset loading failure: {str(e)}")

    projects = db.query(Project).filter(Project.ministry.ilike(f"%{ministry_name}%")).all()
    if not projects:
        return {
            "total_projects": 0, 
            "status_counts": {"Completed": 0, "Ongoing": 0, "Delayed": 0}, 
            "risk_counts": {"High": 0, "Medium": 0, "Low": 0}, 
            "average_danger_index": 0.0
        }

    status_counts = Counter()
    risk_counts = Counter()
    total_danger = 0.0

    for p in projects:
        status_key = "Delayed" if (p.delay_months or 0) > 0 else "Ongoing"
        status_counts[status_key] += 1

        score = compute_row_danger_score(p, linear_model)
        total_danger += score

        if score >= 70:
            tier = "High"
        elif score >= 35:
            tier = "Medium"
        else:
            tier = "Low"
        risk_counts[tier] += 1

    return {
        "total_projects": len(projects),
        "status_counts": {
            "Completed": status_counts["Completed"],
            "Ongoing": status_counts["Ongoing"],
            "Delayed": status_counts["Delayed"]
        },
        "risk_counts": {
            "High": risk_counts["High"],
            "Medium": risk_counts["Medium"],
            "Low": risk_counts["Low"]
        },
        "average_danger_index": round(total_danger / len(projects), 2)
    }


@router.post("/data/validate")
def verify_incoming_contractor_payload(payload: dict, current_user = Depends(get_current_user)):
    """Runs data quality verification for plagiarism traps and spending spikes before database persistence."""
    plagiarism_score = compliance_checks.run_text_plagiarism_engine(
        payload.get("current_report", ""), 
        payload.get("previous_report", "")
    )
    is_round_trap = compliance_checks.check_round_number_trap(
        float(payload.get("reported_physical_progress", 0))
    )
    is_march_rush = compliance_checks.check_march_rush_catcher(
        float(payload.get("avg_prior_spend", 0)), 
        float(payload.get("march_spend", 0))
    )
    
    return {
        "plagiarism_match_percentage": round(plagiarism_score * 100, 2),
        "round_number_trap_triggered": is_round_trap,
        "march_rush_triggered": is_march_rush,
        "is_flagged_for_manual_audit": is_round_trap or is_march_rush or (plagiarism_score > 0.85)
    }
