from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Project, ProjectCategory, RepositorySource
from ..schemas import ProjectCategoryOut, ProjectOut

router = APIRouter(prefix="/api/projects", tags=["Projects & Proof Room"])


@router.get("/categories", response_model=List[ProjectCategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(ProjectCategory).order_by(ProjectCategory.id.asc()).all()


@router.get("", response_model=List[ProjectOut])
def list_projects(
    category: Optional[str] = Query(default=None, description="Filter by category slug"),
    featured: Optional[bool] = Query(default=None, description="Filter by featured tier-1 status"),
    search: Optional[str] = Query(default=None, description="Search in title, description, or tech stack"),
    db: Session = Depends(get_db),
):
    q = (
        db.query(Project)
        .options(
            joinedload(Project.category),
            joinedload(Project.repository_source).joinedload(RepositorySource.license),
            joinedload(Project.evidence_items),
        )
        .order_by(Project.display_order.asc())
    )

    if category and category != "all":
        q = q.join(Project.category).filter(ProjectCategory.slug == category)

    if featured is not None:
        q = q.filter(Project.is_featured == featured)

    projects = q.all()

    if search and search.strip():
        term = search.strip().lower()
        filtered = []
        for p in projects:
            haystack = " ".join(
                [
                    p.title_en,
                    p.title_ar,
                    p.short_description_en,
                    p.short_description_ar,
                    p.project_code,
                    " ".join(p.tech_stack or []),
                ]
            ).lower()
            if term in haystack:
                filtered.append(p)
        return filtered

    return projects


@router.get("/{slug}", response_model=ProjectOut)
def get_project_by_slug(slug: str, db: Session = Depends(get_db)):
    proj = (
        db.query(Project)
        .options(
            joinedload(Project.category),
            joinedload(Project.repository_source).joinedload(RepositorySource.license),
            joinedload(Project.evidence_items),
        )
        .filter(Project.slug == slug)
        .first()
    )
    if not proj:
        raise HTTPException(status_code=404, detail=f"Project '{slug}' not found in The Proof Room.")
    return proj
