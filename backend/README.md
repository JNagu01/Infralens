# INFRA LENS — Python Backend

FastAPI backend for the INFRA LENS hackathon frontend.

## 1. Create environment

Windows PowerShell:

```powershell
cd infralens-backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 2. Configure environment

```powershell
Copy-Item .env.example .env
```

Change `SECRET_KEY` in `.env`.

## 3. Create demo database

```powershell
python seed.py
```

Demo credentials:

```text
username: admin
password: admin123
```

Change this before any real deployment.

## 4. Start API

```powershell
uvicorn app.main:app --reload
```

Open:

```text
http://localhost:8000/docs
```

## API

- POST `/api/v1/auth/login`
- POST `/api/v1/data/ingest`
- GET `/api/v1/dashboard/summary`
- GET `/api/v1/projects/filter?ministry=...&state=...&year=...`
- GET `/api/v1/analysis/{project_id}`
- PUT `/api/v1/projects/{project_id}`

Compatibility endpoints also exist for the current frontend's `/api/dashboard`, `/api/projects`, etc.

## CSV

The ingestion endpoint accepts CSV and attempts common column names such as:

```text
project_id, project_name, ministry, sector, state, year, status,
original_cost, revised_cost, allocated_budget, expenditure,
physical_progress, financial_progress, delay_months
```

Missing numeric fields are filled using averages calculated from the uploaded CSV.

## Redis

Redis is optional for local development. If Redis is unavailable, the backend uses a 5-minute in-memory fallback cache. For the hackathon's production/demo deployment, run Redis and set `REDIS_URL`.

## ML

`app/routers/analysis.py` contains an explainable baseline risk-scoring model so the endpoint works immediately. Replace `predict()` with your trained scikit-learn/XGBoost/PyTorch model when your ML teammate is ready.
