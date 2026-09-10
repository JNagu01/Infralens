from typing import Optional
from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ProjectUpdate(BaseModel):
    current_status: Optional[str] = None
    allocated_budget: Optional[float] = Field(default=None, ge=0)

class ProjectOut(BaseModel):
    project_id: str
    name: str
    description: str = ""
    ministry: str
    sector: str = ""
    state: str = ""
    year: str = ""
    status: str
    original_cost: float
    revised_cost: float
    allocated_budget: float
    expenditure: float
    physical_progress: float
    financial_progress: float
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True

class AnalysisOut(BaseModel):
    project_id: str
    risk_score: float
    predicted_late_months: float
    predicted_cost_overrun: float
    model_confidence: float
    alerts: list[str]
