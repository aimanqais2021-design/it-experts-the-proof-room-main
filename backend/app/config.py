import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'it_experts.db'}")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "ite-proof-room-local-dev-secret-change-in-prod-2026")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

ADMIN_DEFAULT_EMAIL = os.getenv("ADMIN_DEFAULT_EMAIL", "admin@itexperts.dev")
ADMIN_DEFAULT_PASSWORD = os.getenv("ADMIN_DEFAULT_PASSWORD", "ITExperts#Proof2026!")

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads")))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

EVIDENCE_DIR = ROOT_DIR / "evidence"
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".zip", ".txt", ".md", ".py", ".sql", ".csv", ".docx"}
WHATSAPP_NUMBER = "+967781282285"
