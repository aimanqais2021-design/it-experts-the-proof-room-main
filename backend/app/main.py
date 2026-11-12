import time
from collections import defaultdict
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from .config import EVIDENCE_DIR, WHATSAPP_NUMBER
from .database import Base, SessionLocal, engine, get_db
from .models import AnalyticsEvent
from .routers import admin, challenges, leads, projects, services
from .schemas import AnalyticsEventCreate
from .seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="IT EXPERTS — THE PROOF ROOM API",
    description="Premium Technology & Academic Solutions Platform — Verifiable Technical Proof Engine",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory rate limiter for public mutation endpoints (60 requests / minute per IP)
_rate_buckets: dict[str, list[float]] = defaultdict(list)


@app.middleware("http")
async def security_and_rate_limit_middleware(request: Request, call_next):
    if request.method == "POST" and request.url.path.startswith("/api/leads"):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        window = [t for t in _rate_buckets[client_ip] if now - t < 60.0]
        if len(window) >= 60:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Please wait a moment before submitting again."},
            )
        window.append(now)
        _rate_buckets[client_ip] = window

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


if EVIDENCE_DIR.exists():
    app.mount("/evidence", StaticFiles(directory=str(EVIDENCE_DIR)), name="evidence")

app.include_router(projects.router)
app.include_router(services.router)
app.include_router(challenges.router)
app.include_router(leads.router)
app.include_router(admin.router)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "brand": "IT EXPERTS",
        "campaign": "THE PROOF ROOM",
        "whatsapp": WHATSAPP_NUMBER,
        "verified_projects_count": 12,
    }


@app.post("/api/analytics", status_code=201)
def record_analytics_event(payload: AnalyticsEventCreate, db: Session = Depends(get_db)):
    ev = AnalyticsEvent(
        event_type=payload.event_type,
        route_path=payload.route_path,
        language=payload.language,
        event_metadata=payload.event_metadata,
    )
    db.add(ev)
    db.commit()
    return {"recorded": True}
