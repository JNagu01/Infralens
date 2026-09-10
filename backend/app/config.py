import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./infralens.db")
SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_THIS_SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

IMD_API_URL = os.getenv("IMD_API_URL", "")
NCDEX_API_URL = os.getenv("NCDEX_API_URL", "")
