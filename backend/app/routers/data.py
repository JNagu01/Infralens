import csv
import io
from datetime import datetime
from statistics import mean

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project
from app.dependencies import get_current_user
from app.services.external_data import fetch_ims_monsoon_data, fetch_ncdex_material_prices

router = APIRouter()

MINISTRY_ALIASES = {
    "morth": "Ministry of Road Transport & Highways",
    "ministry of road transport & highways": "Ministry of Road Transport & Highways",
    "roads & highways": "Ministry of Road Transport & Highways",
    "railways": "Ministry of Railways",
    "ministry of railways": "Ministry of Railways",
    "coal": "Ministry of Coal",
    "ministry of coal": "Ministry of Coal",
}

def clean_key(k: str) -> str:
    return k.strip().lower().replace(" ", "_").replace("-", "_").replace("/", "_")

def to_float(value, default=None):
    if value is None or str(value).strip() == "":
        return default
    try:
        return float(str(value).replace(",", "").replace("₹", "").strip())
    except ValueError:
        return default

def first(row, *keys):
    for key in keys:
        value = row.get(key)
        if value not in (None, ""):
            return value
    return ""

@router.post("/ingest")
async def ingest_data(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    raw = await file.read()
    text = raw.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))

    rows = [{clean_key(k): v for k, v in row.items()} for row in reader]
    if not rows:
        raise HTTPException(status_code=400, detail="CSV contains no rows")

    # Pull external context. These adapters use configured APIs when available
    # and safely return demo/neutral values when credentials/endpoints are absent.
    monsoon = await fetch_ims_monsoon_data()
    material = await fetch_ncdex_material_prices()

    # Historical averages for numeric fields.
    numeric_fields = [
        "original_cost", "revised_cost", "allocated_budget", "expenditure",
        "physical_progress", "financial_progress", "delay_months"
    ]
    averages = {}
    for field in numeric_fields:
        values = []
        for r in rows:
            v = to_float(first(r, field, field.replace("_", "")))
            if v is not None:
                values.append(v)
        averages[field] = mean(values) if values else 0

    inserted = 0
    updated = 0

    for r in rows:
        project_id = first(r, "project_id", "id", "project_code")
        if not project_id:
            continue

        ministry_raw = first(r, "ministry", "department")
        ministry = MINISTRY_ALIASES.get(
            ministry_raw.strip().lower(),
            ministry_raw or "Unknown"
        )

        def numeric(field, *aliases):
            return to_float(first(r, field, *aliases), averages[field])

        existing = db.query(Project).filter(Project.project_id == project_id).first()

        values = dict(
            name=first(r, "name", "project_name", "project"),
            description=first(r, "description", "project_description"),
            ministry=ministry,
            sector=first(r, "sector"),
            state=first(r, "state"),
            year=first(r, "year", "financial_year"),
            status=first(r, "status", "current_status") or "To Start",
            original_cost=numeric("original_cost", "estimated_cost"),
            revised_cost=numeric("revised_cost", "updated_cost"),
            allocated_budget=numeric("allocated_budget", "budget"),
            expenditure=numeric("expenditure", "spent", "actual_expenditure"),
            physical_progress=numeric("physical_progress", "physical_completion"),
            financial_progress=numeric("financial_progress", "financial_completion"),
            delay_months=numeric("delay_months", "late_months"),
            weather_risk=monsoon.get("risk_score", 0),
            material_price_risk=material.get("risk_score", 0),
            updated_at=datetime.utcnow(),
        )

        if existing:
            for key, value in values.items():
                setattr(existing, key, value)
            updated += 1
        else:
            db.add(Project(project_id=project_id, **values))
            inserted += 1

    db.commit()

    return {
        "message": "Data ingestion completed",
        "inserted": inserted,
        "updated": updated,
        "rows_received": len(rows),
        "imputation": "Historical averages applied to missing numeric fields",
        "external_data": {
            "imd": monsoon,
            "ncdex": material,
        },
    }
