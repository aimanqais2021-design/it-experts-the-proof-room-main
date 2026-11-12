import io
import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.config import ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health_endpoint(client: TestClient):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["brand"] == "IT EXPERTS"
    assert data["campaign"] == "THE PROOF ROOM"
    assert data["whatsapp"] == "+967781282285"


def test_projects_and_featured_filtering(client: TestClient):
    res_all = client.get("/api/projects")
    assert res_all.status_code == 200
    all_projects = res_all.json()
    assert len(all_projects) == 12

    res_feat = client.get("/api/projects?featured=true")
    assert res_feat.status_code == 200
    feat_projects = res_feat.json()
    assert len(feat_projects) == 6
    for p in feat_projects:
        assert p["is_featured"] is True
        assert p["verification_status"] == "VERIFIED"
        assert len(p["evidence_items"]) == 3


def test_project_detail_and_attribution(client: TestClient):
    res = client.get("/api/projects/real-time-object-detection")
    assert res.status_code == 200
    proj = res.json()
    assert proj["project_code"] == "PROJ-01"
    assert proj["repository_source"]["repo_name"] == "ultralytics/ultralytics"
    assert proj["repository_source"]["license"]["spdx_id"] == "AGPL-3.0"
    assert len(proj["evidence_items"]) == 3


def test_services_and_revision_policy(client: TestClient):
    res_srv = client.get("/api/services")
    assert res_srv.status_code == 200
    assert len(res_srv.json()) == 6

    res_pol = client.get("/api/services/revision-policy")
    assert res_pol.status_code == 200
    pol = res_pol.json()
    assert "FREE REVISIONS" in pol["headline_en"]
    assert len(pol["guarantees"]) == 5


def test_interactive_challenges_verification(client: TestClient):
    res_list = client.get("/api/challenges")
    assert res_list.status_code == 200
    challenges = res_list.json()
    assert len(challenges) == 5

    res_verify = client.post(
        "/api/challenges/verify",
        json={"challenge_id": "challenge-python-debug", "selected_option": "A", "language": "en"},
    )
    assert res_verify.status_code == 200
    vdata = res_verify.json()
    assert vdata["is_correct"] is True


def test_free_tech_check_lead_upload_and_revision_workflow(client: TestClient):
    # 1. Submit Free Tech Check
    payload = {
        "full_name": "Dr. Khaled Al-Yemeni",
        "email": "khaled.research@uni.edu",
        "phone_whatsapp": "+967781282285",
        "academic_or_tech_field": "Computer Vision & Medical Diagnostics",
        "request_category": "AI, Deep Learning & Computer Vision",
        "project_description": "Need a reproducible multi-class segmentation benchmark with Dice and IoU evaluation for our research lab.",
        "deadline": "Within 10 Days",
        "consent_granted": True,
    }
    res_create = client.post("/api/leads", json=payload)
    assert res_create.status_code == 201
    lead_data = res_create.json()
    ref_code = lead_data["reference_code"]
    assert ref_code.startswith("ITE-2026-")
    assert "wa.me/967781282285" in lead_data["whatsapp_prefilled_url"]

    # 2. Upload Valid Attachment
    file_bytes = b"Sample specification document for IT EXPERTS Proof Room review."
    res_upload = client.post(
        f"/api/leads/{ref_code}/attachments",
        files={"file": ("project_spec.txt", io.BytesIO(file_bytes), "text/plain")},
    )
    assert res_upload.status_code == 200
    assert len(res_upload.json()["attachments"]) == 1

    # 3. Reject Unsafe File Extension
    res_bad_ext = client.post(
        f"/api/leads/{ref_code}/attachments",
        files={"file": ("malware.exe", io.BytesIO(b"MZ..."), "application/octet-stream")},
    )
    assert res_bad_ext.status_code == 400

    # 4. Submit Free Revision Request
    res_rev = client.post(
        f"/api/leads/{ref_code}/revisions",
        json={"description": "Please include precision-recall curve in high-DPI PDF format.", "within_agreed_scope": True},
    )
    assert res_rev.status_code == 201
    assert res_rev.json()["is_free_revision"] is True

    # 5. Track Lead by Reference
    res_track = client.get(f"/api/leads/track/{ref_code}")
    assert res_track.status_code == 200
    assert res_track.json()["status"] == "REVISION"


def test_admin_authentication_and_lead_status_lifecycle(client: TestClient):
    # 1. Unauthorized call must fail with 401
    unauth = client.get("/api/admin/dashboard-summary")
    assert unauth.status_code == 401

    # 2. Login with default admin credentials
    login_res = client.post(
        "/api/admin/login",
        json={"email": ADMIN_DEFAULT_EMAIL, "password": ADMIN_DEFAULT_PASSWORD},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Fetch dashboard summary
    sum_res = client.get("/api/admin/dashboard-summary", headers=headers)
    assert sum_res.status_code == 200
    kpis = sum_res.json()["kpis"]
    assert kpis["total_projects"] == 12
    assert kpis["verified_projects"] == 12

    # 4. List leads and transition status through workflow
    leads_res = client.get("/api/admin/leads", headers=headers)
    assert leads_res.status_code == 200
    leads_list = leads_res.json()
    assert len(leads_list) >= 1
    target_lead_id = leads_list[0]["id"]

    for next_stage in ["UNDER_REVIEW", "QUOTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CLOSED"]:
        patch_res = client.patch(
            f"/api/admin/leads/{target_lead_id}/status",
            headers=headers,
            json={"status": next_stage, "quoted_amount": "$500 USD", "admin_notes": f"Moved to {next_stage}"},
        )
        assert patch_res.status_code == 200
        assert patch_res.json()["status"] == next_stage
