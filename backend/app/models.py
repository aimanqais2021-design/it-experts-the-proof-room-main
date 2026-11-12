from datetime import datetime, timezone
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=False)
    permissions = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(160), unique=True, nullable=False, index=True)
    full_name = Column(String(160), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    role = relationship("Role", back_populates="users")


class License(Base):
    __tablename__ = "licenses"

    id = Column(Integer, primary_key=True, index=True)
    spdx_id = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(160), nullable=False)
    url = Column(String(255), nullable=False)
    commercial_use_allowed = Column(Boolean, default=True)
    attribution_required = Column(Boolean, default=True)

    repositories = relationship("RepositorySource", back_populates="license")


class RepositorySource(Base):
    __tablename__ = "repository_sources"

    id = Column(Integer, primary_key=True, index=True)
    repo_name = Column(String(160), nullable=False, index=True)
    original_owner = Column(String(120), nullable=False)
    github_url = Column(String(255), nullable=False)
    programming_language = Column(String(80), nullable=False)
    ownership_type = Column(String(60), default="ADAPTED_OPEN_SOURCE")  # ORIGINAL_ITE or ADAPTED_OPEN_SOURCE
    selection_rationale = Column(Text, nullable=False)
    license_id = Column(Integer, ForeignKey("licenses.id"), nullable=False)

    license = relationship("License", back_populates="repositories")
    projects = relationship("Project", back_populates="repository_source")


class ProjectCategory(Base):
    __tablename__ = "project_categories"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(80), unique=True, nullable=False, index=True)
    name_en = Column(String(140), nullable=False)
    name_ar = Column(String(140), nullable=False)
    description_en = Column(Text, nullable=False)
    description_ar = Column(Text, nullable=False)
    icon_name = Column(String(60), default="Cpu")

    projects = relationship("Project", back_populates="category")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    project_code = Column(String(32), unique=True, nullable=False, index=True)
    slug = Column(String(120), unique=True, nullable=False, index=True)
    title_en = Column(String(200), nullable=False)
    title_ar = Column(String(200), nullable=False)
    short_description_en = Column(Text, nullable=False)
    short_description_ar = Column(Text, nullable=False)
    problem_statement_en = Column(Text, nullable=False)
    problem_statement_ar = Column(Text, nullable=False)
    technical_approach_en = Column(Text, nullable=False)
    technical_approach_ar = Column(Text, nullable=False)
    architecture_en = Column(Text, nullable=False)
    architecture_ar = Column(Text, nullable=False)
    tech_stack = Column(JSON, nullable=False, default=list)
    metrics = Column(JSON, nullable=False, default=dict)
    verification_status = Column(String(32), default="VERIFIED", index=True)
    is_featured = Column(Boolean, default=False, index=True)
    display_order = Column(Integer, default=1)
    category_id = Column(Integer, ForeignKey("project_categories.id"), nullable=False)
    repository_source_id = Column(Integer, ForeignKey("repository_sources.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    category = relationship("ProjectCategory", back_populates="projects")
    repository_source = relationship("RepositorySource", back_populates="projects")
    evidence_items = relationship("ProjectEvidence", back_populates="project", cascade="all, delete-orphan")


class ProjectEvidence(Base):
    __tablename__ = "project_evidence"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    evidence_type = Column(String(50), nullable=False)  # overview, execution_result, detailed_view
    title_en = Column(String(180), nullable=False)
    title_ar = Column(String(180), nullable=False)
    caption_en = Column(Text, nullable=False)
    caption_ar = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=False)
    sha256_hash = Column(String(80), nullable=False)
    hardware_info = Column(String(200), nullable=False)
    captured_at = Column(DateTime(timezone=True), default=utcnow)

    project = relationship("Project", back_populates="evidence_items")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    reference_code = Column(String(40), unique=True, nullable=False, index=True)
    full_name = Column(String(160), nullable=False)
    email = Column(String(160), nullable=False, index=True)
    phone_whatsapp = Column(String(60), nullable=False)
    academic_or_tech_field = Column(String(140), nullable=False)
    request_category = Column(String(120), nullable=False, index=True)
    project_description = Column(Text, nullable=False)
    deadline = Column(String(80), nullable=True)
    consent_granted = Column(Boolean, default=True, nullable=False)
    status = Column(String(40), default="NEW", nullable=False, index=True)
    quoted_amount = Column(String(80), nullable=True)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    attachments = relationship("Attachment", back_populates="lead", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="lead", cascade="all, delete-orphan")
    revision_requests = relationship("RevisionRequest", back_populates="lead", cascade="all, delete-orphan")


Index("idx_leads_status_created", Lead.status, Lead.created_at)


class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id", ondelete="CASCADE"), nullable=False, index=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    mime_type = Column(String(120), nullable=False)
    size_bytes = Column(Integer, nullable=False)
    sha256_hash = Column(String(80), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), default=utcnow)

    lead = relationship("Lead", back_populates="attachments")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_role = Column(String(40), nullable=False)  # CLIENT, ADMIN, SYSTEM
    channel = Column(String(40), default="WEB")       # WEB, WHATSAPP, EMAIL
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    lead = relationship("Lead", back_populates="conversations")


class RevisionRequest(Base):
    __tablename__ = "revision_requests"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id", ondelete="CASCADE"), nullable=False, index=True)
    revision_number = Column(Integer, default=1, nullable=False)
    description = Column(Text, nullable=False)
    within_agreed_scope = Column(Boolean, default=True, nullable=False)
    is_free_revision = Column(Boolean, default=True, nullable=False)
    status = Column(String(40), default="IN_REVIEW", nullable=False)  # IN_REVIEW, IN_PROGRESS, COMPLETED
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    lead = relationship("Lead", back_populates="revision_requests")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    title_en = Column(String(180), nullable=False)
    title_ar = Column(String(180), nullable=False)
    description_en = Column(Text, nullable=False)
    description_ar = Column(Text, nullable=False)
    deliverables_en = Column(JSON, default=list)
    deliverables_ar = Column(JSON, default=list)
    icon_name = Column(String(60), default="Code2")
    starting_timeline = Column(String(80), default="3 - 14 Days")
    is_active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=1)


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(80), nullable=False, index=True)
    route_path = Column(String(180), nullable=False)
    language = Column(String(16), default="en")
    event_metadata = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utcnow, index=True)
