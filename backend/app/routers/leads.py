import hashlib
import os
import secrets
import urllib.parse
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session, joinedload

from ..config import ALLOWED_EXTENSIONS, MAX_UPLOAD_BYTES, UPLOAD_DIR, WHATSAPP_NUMBER
from ..database import get_db
from ..models import AnalyticsEvent, Attachment, Conversation, Lead, RevisionRequest
from ..schemas import LeadCreate, LeadResponseOut, RevisionRequestCreate, RevisionRequestOut

router = APIRouter(prefix="/api/leads", tags=["Free Tech Check & Lead Conversion"])


def build_whatsapp_url(lead: Lead) -> str:
    clean_phone = WHATSAPP_NUMBER.replace("+", "").replace(" ", "")
    msg = (
        f"Hello IT EXPERTS — THE PROOF ROOM!\n"
        f"Reference Code: {lead.reference_code}\n"
        f"Name: {lead.full_name}\n"
        f"Category: {lead.request_category}\n"
        f"Field: {lead.academic_or_tech_field}\n"
        f"Deadline: {lead.deadline or 'Flexible'}\n"
        f"Summary: {lead.project_description[:180]}"
    )
    return f"https://wa.me/{clean_phone}?text={urllib.parse.quote(msg)}"


@router.post("", response_model=LeadResponseOut, status_code=status.HTTP_201_CREATED)
def submit_free_tech_check(payload: LeadCreate, db: Session = Depends(get_db)):
    ref_code = f"ITE-2026-{secrets.randbelow(8999) + 1000}"
    while db.query(Lead).filter(Lead.reference_code == ref_code).first():
        ref_code = f"ITE-2026-{secrets.randbelow(8999) + 1000}"

    new_lead = Lead(
        reference_code=ref_code,
        full_name=payload.full_name.strip(),
        email=payload.email.strip(),
        phone_whatsapp=payload.phone_whatsapp.strip(),
        academic_or_tech_field=payload.academic_or_tech_field.strip(),
        request_category=payload.request_category.strip(),
        project_description=payload.project_description.strip(),
        deadline=payload.deadline,
        consent_granted=payload.consent_granted,
        status="NEW",
    )
    db.add(new_lead)
    db.flush()

    db.add(
        Conversation(
            lead_id=new_lead.id,
            sender_role="SYSTEM",
            channel="WEB",
            message=(
                f"Free Initial Technical Assessment logged with reference {ref_code}. "
                f"Covered by the IT EXPERTS 'We Don't Leave You Halfway' Free Revision Policy."
            ),
        )
    )
    db.add(
        AnalyticsEvent(
            event_type="FREE_TECH_CHECK_SUBMITTED",
            route_path="/free-review",
            language="en",
            event_metadata={"reference_code": ref_code, "category": new_lead.request_category},
        )
    )
    db.commit()
    db.refresh(new_lead)

    out = LeadResponseOut.model_validate(new_lead)
    out.whatsapp_prefilled_url = build_whatsapp_url(new_lead)
    return out


@router.post("/{reference_code}/attachments", response_model=LeadResponseOut)
async def upload_lead_attachment(
    reference_code: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    lead = (
        db.query(Lead)
        .options(joinedload(Lead.attachments), joinedload(Lead.conversations), joinedload(Lead.revision_requests))
        .filter(Lead.reference_code == reference_code)
        .first()
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Lead reference code not found.")

    orig_name = Path(file.filename or "attachment.txt").name
    ext = Path(orig_name).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File extension '{ext}' not permitted. Allowed: {sorted(ALLOWED_EXTENSIONS)}",
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 10 MB maximum size limit.")

    sha256_hash = hashlib.sha256(content).hexdigest()
    safe_stored_name = f"{lead.reference_code}_{secrets.token_hex(6)}{ext}"
    dest_path = UPLOAD_DIR / safe_stored_name
    dest_path.write_bytes(content)

    att = Attachment(
        lead_id=lead.id,
        original_filename=orig_name,
        stored_filename=safe_stored_name,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        sha256_hash=sha256_hash,
    )
    db.add(att)
    db.commit()
    db.refresh(lead)

    out = LeadResponseOut.model_validate(lead)
    out.whatsapp_prefilled_url = build_whatsapp_url(lead)
    return out


@router.get("/track/{reference_code}", response_model=LeadResponseOut)
def track_lead_by_reference(reference_code: str, db: Session = Depends(get_db)):
    lead = (
        db.query(Lead)
        .options(joinedload(Lead.attachments), joinedload(Lead.conversations), joinedload(Lead.revision_requests))
        .filter(Lead.reference_code == reference_code.strip().upper())
        .first()
    )
    if not lead:
        raise HTTPException(status_code=404, detail="Reference number not found.")
    out = LeadResponseOut.model_validate(lead)
    out.whatsapp_prefilled_url = build_whatsapp_url(lead)
    return out


@router.post("/{reference_code}/revisions", response_model=RevisionRequestOut, status_code=status.HTTP_201_CREATED)
def request_project_revision(
    reference_code: str,
    payload: RevisionRequestCreate,
    db: Session = Depends(get_db),
):
    lead = db.query(Lead).filter(Lead.reference_code == reference_code.strip().upper()).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead reference code not found.")

    existing_count = db.query(RevisionRequest).filter(RevisionRequest.lead_id == lead.id).count()
    rev = RevisionRequest(
        lead_id=lead.id,
        revision_number=existing_count + 1,
        description=payload.description.strip(),
        within_agreed_scope=payload.within_agreed_scope,
        is_free_revision=bool(payload.within_agreed_scope),
        status="IN_REVIEW",
    )
    lead.status = "REVISION"
    db.add(rev)
    db.commit()
    db.refresh(rev)
    return rev
