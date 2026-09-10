from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Project
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    projects = db.query(Project).all()

    counts = Counter()
    for p in projects:
        status = (p.status or "").strip().lower()
        if status in {"completed", "complete"}:
            key = "Completed"
        elif status in {"held", "on hold", "hold"}:
            key = "Held"
        else:
            key = "To Start"
        counts[key] += 1

    return {
        "total_projects": len(projects),
        "status_counts": {
            "Completed": counts["Completed"],
            "Held": counts["Held"],
            "To Start": counts["To Start"],
        },
    }

# Backward-compatible endpoint for the current frontend api.js.
@router.get("")
def dashboard_alias(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return dashboard_summary(db, current_user)
