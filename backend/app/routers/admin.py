from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from ..auth import create_access_token, get_current_admin, verify_password
from ..database import get_db
from ..models import (
    AnalyticsEvent,
    Conversation,
    Lead,
    Project,
    ProjectCategory,
    ProjectEvidence,
    RevisionRequest,
    Service,
    User,
)
from ..schemas import (
    ConversationCreate,
    ConversationOut,
    LeadResponseOut,
    LeadStatusUpdate,
    LoginRequest,
    ProjectOut,
    RevisionRequestOut,
    ServiceOut,
    TokenResponse,
)

router = APIRouter(prefix="/api/admin", tags=["Administration Dashboard"])


@router.post("/login", response_model=TokenResponse)
def admin_login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.strip().lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator email or password.",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrator account disabled.")

    user.last_login_at = datetime.now(timezone.utc)
    db.add(
        AnalyticsEvent(
            event_type="ADMIN_LOGIN",
            route_path="/admin",
            language="en",
            event_metadata={"admin_email": user.email},
        )
    )
    db.commit()

    role_name = user.role.name if user.role else "SUPER_ADMIN"
    token = create_access_token(subject_email=user.email, role_name=role_name)
    return TokenResponse(
        access_token=token,
        user_email=user.email,
        user_name=user.full_name,
        role=role_name,
    )


@router.get("/dashboard-summary")
def get_dashboard_summary(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    total_projects = db.query(Project).count()
    verified_projects = db.query(Project).filter(Project.verification_status == "VERIFIED").count()
    featured_projects = db.query(Project).filter(Project.is_featured == True).count()
    total_evidence = db.query(ProjectEvidence).count()
    total_leads = db.query(Lead).count()
    total_revisions = db.query(RevisionRequest).count()
    free_revisions = db.query(RevisionRequest).filter(RevisionRequest.is_free_revision == True).count()
    total_services = db.query(Service).count()

    status_rows = db.query(Lead.status, func.count(Lead.id)).group_by(Lead.status).all()
    leads_by_status = {row[0]: row[1] for row in status_rows}

    category_rows = db.query(Lead.request_category, func.count(Lead.id)).group_by(Lead.request_category).all()
    leads_by_category = [{"category": row[0], "count": row[1]} for row in category_rows]

    return {
        "admin_user": {
            "email": current_admin.email,
            "full_name": current_admin.full_name,
        },
        "kpis": {
            "total_projects": total_projects,
            "verified_projects": verified_projects,
            "featured_projects": featured_projects,
            "total_evidence_files": total_evidence,
            "total_leads": total_leads,
            "total_revisions": total_revisions,
            "free_revisions_count": free_revisions,
            "active_services": total_services,
        },
        "leads_by_status": leads_by_status,
        "leads_by_category": leads_by_category,
        "workflow_stages": [
            "NEW",
            "UNDER_REVIEW",
            "QUOTED",
            "ACCEPTED",
            "IN_PROGRESS",
            "REVISION",
            "COMPLETED",
            "CLOSED",
        ],
    }


@router.get("/leads", response_model=List[LeadResponseOut])
def admin_list_leads(
    status_filter: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    q = (
        db.query(Lead)
        .options(
            joinedload(Lead.attachments),
            joinedload(Lead.conversations),
            joinedload(Lead.revision_requests),
        )
        .order_by(Lead.created_at.desc())
    )
    if status_filter and status_filter != "ALL":
        q = q.filter(Lead.status == status_filter.upper())
    return q.all()


@router.patch("/leads/{lead_id}/status", response_model=LeadResponseOut)
def admin_update_lead_status(
    lead_id: int,
    payload: LeadStatusUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    lead = (
        db.query(Lead)
        .options(
            joinedload(Lead.attachments),
            joinedload(Lead.conversations),
            joinedload(Lead.revision_requests),
        )
        .filter(Lead.id == lead_id)
        .first()
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found.")

    old_status = lead.status
    lead.status = payload.status
    if payload.quoted_amount is not None:
        lead.quoted_amount = payload.quoted_amount
    if payload.admin_notes is not None:
        lead.admin_notes = payload.admin_notes

    db.add(
        Conversation(
            lead_id=lead.id,
            sender_role="ADMIN",
            channel="WEB",
            message=f"Status updated from {old_status} to {payload.status} by {current_admin.full_name}.",
        )
    )
    db.commit()
    db.refresh(lead)
    return lead


@router.post("/leads/{lead_id}/conversations", response_model=ConversationOut)
def admin_add_conversation_note(
    lead_id: int,
    payload: ConversationCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found.")

    conv = Conversation(
        lead_id=lead.id,
        sender_role=payload.sender_role,
        channel=payload.channel,
        message=payload.message.strip(),
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


@router.get("/revisions", response_model=List[RevisionRequestOut])
def admin_list_revisions(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return db.query(RevisionRequest).order_by(RevisionRequest.created_at.desc()).all()


@router.patch("/revisions/{revision_id}", response_model=RevisionRequestOut)
def admin_resolve_revision(
    revision_id: int,
    status_value: str = "COMPLETED",
    resolution_notes: str = "Verified and delivered free of charge within agreed scope.",
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    rev = db.query(RevisionRequest).filter(RevisionRequest.id == revision_id).first()
    if not rev:
        raise HTTPException(status_code=404, detail="Revision request not found.")
    rev.status = status_value.upper()
    rev.resolution_notes = resolution_notes
    if rev.status == "COMPLETED":
        rev.resolved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(rev)
    return rev


@router.patch("/projects/{project_id}/toggle-featured", response_model=ProjectOut)
def admin_toggle_featured_project(
    project_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    proj = db.query(Project).filter(Project.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found.")
    proj.is_featured = not proj.is_featured
    db.commit()
    db.refresh(proj)
    return proj
