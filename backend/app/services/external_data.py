import httpx
from app.config import IMD_API_URL, NCDEX_API_URL

async def _get_json(url):
    if not url:
        return None
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
    except Exception:
        return None

async def fetch_ims_monsoon_data():
    data = await _get_json(IMD_API_URL)
    if data is not None:
        return {"source": "IMD", "risk_score": 50, "raw": data}
    return {
        "source": "IMD-configured-endpoint-not-available",
        "risk_score": 0,
        "raw": None,
    }

async def fetch_ncdex_material_prices():
    data = await _get_json(NCDEX_API_URL)
    if data is not None:
        return {"source": "NCDEX", "risk_score": 50, "raw": data}
    return {
        "source": "NCDEX-configured-endpoint-not-available",
        "risk_score": 0,
        "raw": None,
    }
