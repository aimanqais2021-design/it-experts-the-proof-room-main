# CODEBASE_MAP.md — Living Architecture Blueprint

## Directory Layout
```text
d:\ADS\
├── AGENTS.md                        # Core architectural & brand directives
├── PROJECT_PLAN.md                  # Phase-by-phase execution log & checklist
├── CODEBASE_MAP.md                  # Living codebase map
├── README.md                        # Comprehensive documentation & setup guide
├── .env.example                     # Environment template
├── .gitignore                       # Git exclusions (no secrets, venvs, weights)
├── docker-compose.yml               # Full-stack PostgreSQL + Backend + Frontend orchestration
├── .github/
│   └── workflows/
│       └── ci.yml                   # Automated Pytest, TypeScript, and Build pipeline
├── docs/
│   ├── REPOSITORY_RESEARCH.md       # Deep evaluation of open-source repositories across 10 domains
│   ├── EVIDENCE_POLICY.md           # Verifiable screenshot & execution evidence standards
│   ├── TESTING.md                   # QA, Pytest, and Playwright E2E test report
│   └── DEPLOYMENT.md                # Production Docker, PostgreSQL, and HTTPS deployment guide
├── scripts/
│   ├── generate_real_demos.py       # Executes real AI/CV/NLP/Network/Sim workloads & outputs verifiable artifacts
│   ├── capture_screenshots.py       # Automated headless browser screenshot capture pipeline
│   └── validate_projects.py         # Validates overview.png, execution-result.png, detailed-view.png, project-info.json
├── evidence/                        # Captured project evidence & metadata manifests
│   └── <project-slug>/
│       ├── overview.png
│       ├── execution-result.png
│       ├── detailed-view.png
│       └── project-info.json
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/                     # Database migrations
│   ├── app/
│   │   ├── main.py                  # FastAPI entry point, CORS, rate-limiting, static evidence mount
│   │   ├── config.py                # Environment configuration
│   │   ├── database.py              # SQLAlchemy 2.0 engine & session management
│   │   ├── models.py                # 13 normalized relational models
│   │   ├── schemas.py               # Pydantic v2 strict boundary schemas
│   │   ├── auth.py                  # Password hashing (bcrypt/pbkdf2), JWT token issue & RBAC guard
│   │   ├── seed.py                  # Initial seeding for 12 showcase projects, categories, services, admin user
│   │   └── routers/
│   │       ├── projects.py          # Proof Room, categories, evidence, attribution endpoints
│   │       ├── leads.py             # Free Tech Check submission, file uploads, reference tracking
│   │       ├── challenges.py        # Interactive challenge verification & telemetry
│   │       ├── services.py          # Service catalog & revision policy endpoints
│   │       └── admin.py             # Protected Admin endpoints (Leads workflow, Projects, Revisions, Analytics)
│   └── tests/
│       └── test_api.py              # Pytest suite covering Auth, Projects, Leads, File Upload, Admin Workflow
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx                  # Route-level navigation & layout wrapper
        ├── context/
        │   ├── LanguageContext.tsx   # Bilingual EN (LTR) / AR (RTL) translations & document dir manager
        │   └── AuthContext.tsx       # Admin JWT session state
        ├── data/
        │   └── fallbackData.ts       # High-availability typed dataset synchronized with backend API
        ├── components/
        │   ├── Navbar.tsx            # Luxury Black & Gold bilingual navbar with language switcher
        │   ├── Footer.tsx            # Brand footer with WhatsApp CTA & quick links
        │   ├── WhatsAppButton.tsx    # Floating & contextual pre-filled WhatsApp (+967781282285) triggers
        │   └── RevisionBanner.tsx    # "We Don't Leave You Halfway" policy showcase
        └── pages/
            ├── HomePage.tsx          # /
            ├── ProofRoomPage.tsx     # /proof-room
            ├── ProjectDetailPage.tsx # /projects/:slug
            ├── ChallengesPage.tsx    # /challenges
            ├── ServicesPage.tsx      # /services
            ├── FreeReviewPage.tsx    # /free-review
            ├── AboutPage.tsx         # /about
            ├── ContactPage.tsx       # /contact
            └── AdminPage.tsx         # /admin
```
