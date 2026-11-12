"""Initial normalized 13-table schema for IT EXPERTS Proof Room

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-11-12 00:30:00
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Automatically creates all 13 normalized tables defined in app.models.Base
    from app.database import Base
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    from app.database import Base
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)
