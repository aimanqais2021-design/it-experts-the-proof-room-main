# IT EXPERTS — THE PROOF ROOM
### *YOUR IT WORLD. OUR EXPERTISE.*
> **"DON'T TAKE OUR WORD FOR IT. SEE WHAT WE CAN BUILD."**

A production-grade, bilingual (English LTR & Arabic RTL) technology brand and verifiable proof-of-expertise platform designed to convert university researchers, capstone/graduate students, and enterprise clients into qualified customers.

---

## 1. Platform Overview & Visual Identity

- **Brand**: `IT EXPERTS`
- **Campaign**: `THE PROOF ROOM`
- **Aesthetic**: Luxury Black & Gold (`#C9A45C` Gold Primary, `#090B10` Deep Obsidian Background, `#171A20` Surface, `#F1E9D8` Warm Ivory Text)
- **Direct WhatsApp Integration**: `+967781282285` (with pre-filled contextual service messages and reference codes)
- **Ironclad Revision Guarantee**: *"WE DON'T LEAVE YOU HALFWAY. FREE REVISIONS — NO EXTRA FEES."*

---

## 2. Architecture & Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend (`frontend/`)** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Bilingual EN/AR i18n Context |
| **Backend (`backend/`)** | Python 3.12, FastAPI, SQLAlchemy 2.0 ORM, Pydantic v2, Alembic Migrations, PBKDF2/Bcrypt + JWT Auth |
| **Database** | PostgreSQL 16 (Docker Compose Production) / SQLite 3 (Zero-Config Local & CI Testing) |
| **Evidence Pipeline (`scripts/`)** | PyTorch, OpenCV, Scikit-Learn, SciPy, NetworkX, Matplotlib, Pillow, SHA-256 Integrity Validator |
| **DevOps & QA** | Docker, Docker Compose, GitHub Actions CI (`.github/workflows/ci.yml`), Pytest, E2E HTTP Harness |

---

## 3. Verified Proof Room Showcase Catalog (12 Executed Projects)

Every project in `evidence/<slug>/` (and mirrored to `frontend/public/evidence/<slug>/`) has been executed locally and validated with 3 genuine `1440x900` screenshots (`overview.png`, `execution-result.png`, `detailed-view.png`) and a SHA-256 signed `project-info.json` manifest:

1. **`PROJ-01` — Real-Time Object Detection** (`Computer Vision & AI` | `ultralytics/ultralytics` | `AGPL-3.0` | **Tier-1 Featured**)
2. **`PROJ-02` — Image Segmentation Studio** (`Computer Vision` | `scikit-image/scikit-image` | `BSD-3-Clause` | **Tier-1 Featured**)
3. **`PROJ-03` — Machine Learning Prediction Lab** (`AI & ML` | `scikit-learn/scikit-learn` | `BSD-3-Clause` | **Tier-1 Featured**)
4. **`PROJ-04` — NLP & Sentiment Analysis** (`NLP & LLMs` | `huggingface/transformers` | `Apache-2.0` | **Tier-1 Featured**)
5. **`PROJ-05` — Document Intelligence & RAG** (`Knowledge AI` | `chroma-core/chroma` | `Apache-2.0` | **Tier-1 Featured**)
6. **`PROJ-06` — Full-Stack Web Application** (`Web Development` | `fastapi/full-stack-fastapi-template` | `MIT` | **Tier-1 Featured**)
7. **`PROJ-07` — Database Management System** (`Data Engineering` | `sqlalchemy/sqlalchemy` | `MIT`)
8. **`PROJ-08` — Network Topology Simulator** (`Computer Networking` | `networkx/networkx` | `BSD-3-Clause`)
9. **`PROJ-09` — Network Traffic Analyzer** (`Cybersecurity` | `secdev/scapy` | `BSD-3-Clause`)
10. **`PROJ-10` — Big Data Pipeline** (`Data Engineering` | `pandas-dev/pandas` | `BSD-3-Clause`)
11. **`PROJ-11` — Engineering Simulation Lab** (`Engineering Sim` | `scipy/scipy` | `BSD-3-Clause`)
12. **`PROJ-12` — Scientific Research & Analytics** (`Scientific Research` | `scipy/scipy` | `BSD-3-Clause`)

---

## 4. Quick Start & Local Installation

### Step 1: Validate or Regenerate Project Evidence
```bash
python scripts/capture_screenshots.py
python scripts/validate_projects.py
```

### Step 2: Run the Backend API & Pytest Suite
```bash
cd backend
pip install -r requirements.txt
pytest tests/test_api.py -v
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Step 3: Run the Frontend Web Application
```bash
cd frontend
npm install
npm run typecheck
npm run build
npm run dev
```

### Step 4: Full-Stack Docker Deployment
```bash
cp .env.example .env
docker compose up -d --build
```

---

## 5. Documentation Index

- [Open-Source Repository Research (`docs/REPOSITORY_RESEARCH.md`)](docs/REPOSITORY_RESEARCH.md)
- [Evidence & Screenshot Integrity Policy (`docs/EVIDENCE_POLICY.md`)](docs/EVIDENCE_POLICY.md)
- [Testing & Quality Assurance Report (`docs/TESTING.md`)](docs/TESTING.md)
- [Production Deployment Guide (`docs/DEPLOYMENT.md`)](docs/DEPLOYMENT.md)
