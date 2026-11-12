from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


LEAD_VALID_STATUSES = {
    "NEW",
    "UNDER_REVIEW",
    "QUOTED",
    "ACCEPTED",
    "IN_PROGRESS",
    "REVISION",
    "COMPLETED",
    "CLOSED",
}


class LicenseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    spdx_id: str
    name: str
    url: str
    commercial_use_allowed: bool
    attribution_required: bool


class RepositorySourceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    repo_name: str
    original_owner: str
    github_url: str
    programming_language: str
    ownership_type: str
    selection_rationale: str
    license: LicenseOut


class ProjectCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name_en: str
    name_ar: str
    description_en: str
    description_ar: str
    icon_name: str


class ProjectEvidenceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    evidence_type: str
    title_en: str
    title_ar: str
    caption_en: str
    caption_ar: str
    image_url: str
    sha256_hash: str
    hardware_info: str
    captured_at: datetime


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    project_code: str
    slug: str
    title_en: str
    title_ar: str
    short_description_en: str
    short_description_ar: str
    problem_statement_en: str
    problem_statement_ar: str
    technical_approach_en: str
    technical_approach_ar: str
    architecture_en: str
    architecture_ar: str
    tech_stack: List[str]
    metrics: Dict[str, Any]
    verification_status: str
    is_featured: bool
    display_order: int
    category: ProjectCategoryOut
    repository_source: RepositorySourceOut
    evidence_items: List[ProjectEvidenceOut]


class ServiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    title_en: str
    title_ar: str
    description_en: str
    description_ar: str
    deliverables_en: List[str]
    deliverables_ar: List[str]
    icon_name: str
    starting_timeline: str
    is_active: bool
    display_order: int


class LeadCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone_whatsapp: str = Field(..., min_length=6, max_length=50)
    academic_or_tech_field: str = Field(..., min_length=2, max_length=140)
    request_category: str = Field(..., min_length=2, max_length=120)
    project_description: str = Field(..., min_length=15, max_length=5000)
    deadline: Optional[str] = Field(default="Flexible / Within 2 Weeks", max_length=80)
    consent_granted: bool = Field(default=True)

    @field_validator("consent_granted")
    @classmethod
    def check_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Consent to process submitted project details is required.")
        return v


class AttachmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    original_filename: str
    mime_type: str
    size_bytes: int
    sha256_hash: str
    uploaded_at: datetime


class RevisionRequestCreate(BaseModel):
    description: str = Field(..., min_length=10, max_length=2000)
    within_agreed_scope: bool = True


class RevisionRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    lead_id: int
    revision_number: int
    description: str
    within_agreed_scope: bool
    is_free_revision: bool
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime


class ConversationCreate(BaseModel):
    sender_role: str = Field(default="ADMIN")
    channel: str = Field(default="WEB")
    message: str = Field(..., min_length=2, max_length=3000)


class ConversationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sender_role: str
    channel: str
    message: str
    created_at: datetime


class LeadResponseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    reference_code: str
    full_name: str
    email: str
    phone_whatsapp: str
    academic_or_tech_field: str
    request_category: str
    project_description: str
    deadline: Optional[str]
    status: str
    quoted_amount: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    attachments: List[AttachmentOut] = []
    conversations: List[ConversationOut] = []
    revision_requests: List[RevisionRequestOut] = []
    whatsapp_prefilled_url: Optional[str] = None


class LeadStatusUpdate(BaseModel):
    status: str
    quoted_amount: Optional[str] = None
    admin_notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        upper = v.upper().strip()
        if upper not in LEAD_VALID_STATUSES:
            raise ValueError(f"Invalid status '{v}'. Must be one of: {sorted(LEAD_VALID_STATUSES)}")
        return upper


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_email: str
    user_name: str
    role: str


class ChallengeSubmission(BaseModel):
    challenge_id: str
    selected_option: str
    language: str = "en"


class AnalyticsEventCreate(BaseModel):
    event_type: str = Field(..., min_length=2, max_length=80)
    route_path: str = Field(..., min_length=1, max_length=180)
    language: str = Field(default="en", max_length=16)
    event_metadata: Dict[str, Any] = Field(default_factory=dict)
