import json
import time
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project
from app.schemas import ProjectUpdate, ProjectOut
from app.dependencies import get_current_user
from app.services.cache import cache_get, cache_set

router = APIRouter()

def serialize(p: Project):
    return {
        "project_id": p.project_id,
        "name": p.name,
        "description": p.description or "",
        "ministry": p.ministry or "",
        "sector": p.sector or "",
        "state": p.state or "",
        "year": p.year or "",
        "status": p.status or "",
        "original_cost": p.original_cost or 0,
        "revised_cost": p.revised_cost or 0,
        "allocated_budget": p.allocated_budget or 0,
        "expenditure": p.expenditure or 0,
        "physical_progress": p.physical_progress or 0,
        "financial_progress": p.financial_progress or 0,
        "updated_at": p.updated_at.isoformat() if p.updated_at else None,
    }

@router.get("/filter")
def filter_projects(
    ministry: str | None = Query(default=None),
    state: str | None = Query(default=None),
    year: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    cache_key = "projects:" + json.dumps(
        {"ministry": ministry, "state": state, "year": year},
        sort_keys=True
    )

    cached = cache_get(cache_key)
    if cached is not None:
        return {"source": "redis", "count": len(cached), "projects": cached}

    query = db.query(Project)
    if ministry:
        query = query.filter(Project.ministry.ilike(ministry))
    if state:
        query = query.filter(Project.state.ilike(state))
    if year:
        query = query.filter(Project.year.ilike(year))

    result = [serialize(p) for p in query.all()]
    cache_set(cache_key, result, ttl=300)

    return {"source": "database", "count": len(result), "projects": result}

@router.get("")
def all_projects(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return {"projects": [serialize(p) for p in db.query(Project).all()]}

@router.get("/{project_id}")
def get_project(project_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    p = db.query(Project).filter(Project.project_id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize(p)

@router.put("/{project_id}")
def update_project(
    project_id: str,
    payload: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    p = db.query(Project).filter(Project.project_id == project_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    if payload.current_status is not None:
        p.status = payload.current_status
    if payload.allocated_budget is not None:
        p.allocated_budget = payload.allocated_budget

    p.updated_at = __import__("datetime").datetime.utcnow()
    db.commit()
    db.refresh(p)

    return {"message": "Project updated", "project": serialize(p)}
