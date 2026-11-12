# Deployment & Production Operations Guide
**Platform**: IT EXPERTS — THE PROOF ROOM  

---

## 1. Local Development & Verification Setup

### A. Backend API (FastAPI + SQLAlchemy 2.0)
```bash
cd backend
pip install -r requirements.txt
# Run database migrations (optional, auto-created & seeded on startup)
alembic upgrade head
# Start FastAPI server on port 8000
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### B. Frontend Web Application (React 18 + TypeScript + Vite)
```bash
cd frontend
npm install
npm run dev
# Opens on http://localhost:5173 with /api proxy to http://127.0.0.1:8000
```

### C. Re-running the Real Evidence Capture & Validation Pipeline
```bash
python scripts/capture_screenshots.py
python scripts/validate_projects.py
```

---

## 2. Containerized Production Deployment (Docker Compose + PostgreSQL 16)

1. Copy `.env.example` to `.env` and configure production secrets:
   ```bash
   cp .env.example .env
   ```
2. Replace `POSTGRES_PASSWORD`, `JWT_SECRET_KEY`, and `ADMIN_DEFAULT_PASSWORD` with strong cryptographic values.
3. Launch the full stack:
   ```bash
   docker compose up -d --build
   ```
4. Services exposed:
   - **PostgreSQL 16 Database**: Internal port `5432` (persisted via `postgres_data` volume)
   - **FastAPI Backend**: `http://localhost:8000` (`/api/health`, `/docs`)
   - **Nginx Production Frontend**: `http://localhost:8080`

---

## 3. HTTPS, Reverse Proxy & Database Backup Guidance

### HTTPS / TLS Termination
- In production, place **Caddy** or **Nginx + Certbot (Let's Encrypt)** in front of the frontend and backend containers to enforce TLS 1.3 (`https://`), HSTS (`Strict-Transport-Security`), and HTTP-to-HTTPS redirection.

### Automated PostgreSQL Backups
- Schedule a daily cron job on the host server:
  ```bash
  docker exec -t ite_proof_room_db pg_dump -U itexperts itexperts_proof_room | gzip > /backups/ite_db_$(date +%F).sql.gz
  ```
