from app.database import Base, engine, SessionLocal
from app.models import User, Project
from app.security import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

if not db.query(User).filter(User.username == "admin").first():
    db.add(User(username="admin", password_hash=hash_password("admin123"), role="admin"))

demo_projects = [
    dict(project_id="INF-001", name="Eastern Highway Development",
         description="Major highway infrastructure development project.",
         ministry="Ministry of Road Transport & Highways", sector="Roads & Highways",
         state="Maharashtra", year="2024-25", status="Delayed",
         original_cost=42500, revised_cost=47200, allocated_budget=45000,
         expenditure=28700, physical_progress=62, financial_progress=68,
         delay_months=4, weather_risk=45, material_price_risk=55),
    dict(project_id="INF-002", name="National Rail Corridor",
         description="Strategic railway corridor modernization.",
         ministry="Ministry of Railways", sector="Railways",
         state="Karnataka", year="2024-25", status="To Start",
         original_cost=30000, revised_cost=30000, allocated_budget=30000,
         expenditure=5000, physical_progress=20, financial_progress=18,
         delay_months=1, weather_risk=30, material_price_risk=40),
    dict(project_id="INF-003", name="Coal Logistics Expansion",
         description="Coal transportation and logistics expansion project.",
         ministry="Ministry of Coal", sector="Mining & Logistics",
         state="Odisha", year="2025-26", status="Held",
         original_cost=18000, revised_cost=20500, allocated_budget=19000,
         expenditure=9000, physical_progress=40, financial_progress=48,
         delay_months=7, weather_risk=65, material_price_risk=70),
]

for item in demo_projects:
    if not db.query(Project).filter(Project.project_id == item["project_id"]).first():
        db.add(Project(**item))

db.commit()
db.close()

print("Database initialized.")
print("Demo login: admin / admin123")
