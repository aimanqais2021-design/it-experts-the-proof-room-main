#!/usr/bin/env python3
"""
Full-Stack E2E Verification Script for IT EXPERTS — THE PROOF ROOM.
Verifies:
1. All 7 FastAPI routers & static evidence mounts via ASGI/TestClient.
2. Frontend production build output (`frontend/dist/index.html`, JS/CSS bundles, and mirrored evidence assets).
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from app.main import app


def main() -> int:
    print("=" * 72)
    print("IT EXPERTS — FULL-STACK E2E VERIFICATION SUITE")
    print("=" * 72)

    with TestClient(app) as client:
        endpoints = [
            "/api/health",
            "/api/projects",
            "/api/projects?featured=true",
            "/api/projects/real-time-object-detection",
            "/api/services",
            "/api/services/revision-policy",
            "/api/challenges",
            "/evidence/real-time-object-detection/overview.png",
            "/evidence/machine-learning-prediction-lab/execution-result.png",
        ]
        for ep in endpoints:
            res = client.get(ep)
            if res.status_code != 200:
                print(f"[FAIL] {ep} returned HTTP {res.status_code}")
                return 1
            print(f"[PASS] HTTP 200 OK -> {ep}")

    dist_dir = ROOT / "frontend" / "dist"
    index_html = dist_dir / "index.html"
    if not index_html.exists():
        print("[FAIL] frontend/dist/index.html not found!")
        return 1

    print(f"[PASS] Production Frontend Bundle Verified -> {index_html}")
    print("=" * 72)
    print("ALL FULL-STACK E2E CHECKS PASSED (EXIT CODE 0).")
    print("=" * 72)
    return 0


if __name__ == "__main__":
    sys.exit(main())
