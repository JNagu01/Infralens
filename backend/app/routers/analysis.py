from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project
from app.dependencies import get_current_user
from app.schemas import AnalysisOut

router = APIRouter()

def clamp(value, low=0, high=100):
    return max(low, min(high, value))

def predict(project: Project):
    # Hackathon-ready explainable baseline.
    # Replace this function with your trained ML model later.
    progress_gap = max(0, (project.financial_progress or 0) - (project.physical_progress or 0))
    cost_base = project.original_cost or 0
    revised = project.revised_cost or cost_base
    cost_overrun = max(0, revised - cost_base)

    score = (
        0.35 * (project.delay_months or 0) * 5
        + 0.25 * (100 - (project.physical_progress or 0))
        + 0.15 * (project.weather_risk or 0)
        + 0.15 * (project.material_price_risk or 0)
        + 0.10 * progress_gap
    )
    score = round(clamp(score), 1)

    late_months = round(
        max(0, (100 - (project.physical_progress or 0)) / 20 + (project.delay_months or 0) * 0.5),
        1
    )

    confidence = round(clamp(65 + min(25, (project.physical_progress or 0) * 0.2)), 1)

    alerts = []
    if score >= 70:
        alerts.append("High risk: immediate intervention recommended.")
    elif score >= 50:
        alerts.append("Medium risk: monitor project closely.")
    else:
        alerts.append("Low risk: project currently appears stable.")

    if project.physical_progress < project.financial_progress - 10:
        alerts.append("Financial progress is significantly ahead of physical progress.")
    if cost_overrun > 0:
        alerts.append(f"Estimated revised cost is ₹{cost_overrun:,.0f} above original cost.")
    if project.weather_risk >= 60:
        alerts.append("Monsoon/weather conditions may increase execution risk.")
    if project.material_price_risk >= 60:
        alerts.append("Material price volatility may affect project cost.")

    return {
        "project_id": project.project_id,
        "risk_score": score,
        "predicted_late_months": late_months,
        "predicted_cost_overrun": round(cost_overrun, 2),
        "model_confidence": confidence,
        "alerts": alerts,
    }

@router.get("/{project_id}", response_model=AnalysisOut)
def project_analysis(
    project_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return predict(project)
