from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, data, dashboard, projects, analysis

app = FastAPI(
    title="INFRA LENS API",
    version="1.0.0",
    description="Backend API for INFRA LENS infrastructure project risk monitoring."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to your frontend URL before production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(data.router, prefix="/api/v1/data", tags=["Data Ingestion"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["ML Analysis"])

@app.get("/")
def root():
    return {"name": "INFRA LENS API", "status": "running", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "healthy"}
