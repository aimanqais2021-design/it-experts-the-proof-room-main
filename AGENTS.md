# AGENTS.md — IT EXPERTS: THE PROOF ROOM

## Project Identity
- **Brand**: IT EXPERTS
- **Campaign**: THE PROOF ROOM
- **Primary Tagline**: YOUR IT WORLD. OUR EXPERTISE.
- **Secondary Tagline**: DON'T TAKE OUR WORD FOR IT. SEE WHAT WE CAN BUILD.
- **Palette**: Luxury Black & Gold (`#C9A45C` Gold Primary, `#090B10` Deep Obsidian Background, `#171A20` Elevated Surface, `#F1E9D8` Warm Ivory Text)
- **WhatsApp Integration**: `+967781282285`

## Architecture & Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide Icons (`frontend/`)
- **Backend**: Python 3.12 + FastAPI + SQLAlchemy 2.0 + Pydantic v2 + Alembic (`backend/`)
- **Database**: PostgreSQL (Docker Compose production / SQLite fallback with identical SQLAlchemy models for local zero-config testing & CI verification)
- **Evidence & Automation**: Python real execution scripts + Playwright automated screenshot capture (`scripts/capture_screenshots.py`, `scripts/validate_projects.py`, `evidence/`)
- **Infrastructure**: Docker Compose (`docker-compose.yml`), GitHub Actions (`.github/workflows/ci.yml`), Pytest (`backend/tests/`), Playwright E2E (`frontend/e2e/`)

## Core Engineering Rules
1. **Verifiable Proof Only**: Every showcase project in the Proof Room is backed by genuine execution outputs, real data processing on local GPU/CPU (`RTX 5070 Ti` / Python scientific stack), and verified screenshot evidence (`overview.png`, `execution-result.png`, `detailed-view.png`, `project-info.json`).
2. **Bilingual First-Class Support (EN / AR)**: Full English (LTR) and Arabic (RTL) support across all pages, forms, interactive challenges, and navigation.
3. **4 Essential UI States**: Every data-driven view implements Loading (luxury skeleton), Empty (actionable zero-state), Error (graceful retry), and Success states.
4. **Security & Privacy**: JWT authentication with bcrypt password hashing for `/admin`, strict Pydantic validation, rate limiting, file upload sanitization, and zero secrets in code or Git history.
