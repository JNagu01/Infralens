from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="officer")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")

    ministry = Column(String(150), index=True, nullable=False)
    sector = Column(String(150), index=True, default="")
    state = Column(String(100), index=True, default="")
    year = Column(String(30), index=True, default="")

    status = Column(String(50), index=True, default="To Start")

    original_cost = Column(Float, default=0)
    revised_cost = Column(Float, default=0)
    allocated_budget = Column(Float, default=0)
    expenditure = Column(Float, default=0)

    physical_progress = Column(Float, default=0)
    financial_progress = Column(Float, default=0)

    delay_months = Column(Float, default=0)
    weather_risk = Column(Float, default=0)
    material_price_risk = Column(Float, default=0)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
