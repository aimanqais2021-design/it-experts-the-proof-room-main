from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Service
from ..schemas import ServiceOut

router = APIRouter(prefix="/api/services", tags=["Services & Revision Policy"])


@router.get("", response_model=List[ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return (
        db.query(Service)
        .filter(Service.is_active == True)
        .order_by(Service.display_order.asc())
        .all()
    )


@router.get("/revision-policy")
def get_revision_policy():
    return {
        "headline_en": "WE DON'T LEAVE YOU HALFWAY. FREE REVISIONS — NO EXTRA FEES.",
        "headline_ar": "لا نتركك في منتصف الطريق. تعديلات مجانية — بدون أي رسوم إضافية.",
        "guarantees": [
            {
                "id": "scope-free",
                "title_en": "100% Free Revisions Within Agreed Scope",
                "title_ar": "تعديلات مجانية بالكامل ضمن النطاق المتفق عليه",
                "detail_en": "Every refinement, parameter adjustment, or formatting update within your original agreed technical scope is completely free.",
                "detail_ar": "جميع التعديلات والتحسينات وضبط المعاملات ضمن النطاق الفني المتفق عليه مجانية تماماً بدون أي تكلفة إضافية.",
            },
            {
                "id": "bug-free",
                "title_en": "Free Defect & Incomplete Requirement Fixes",
                "title_ar": "إصلاح مجاني لأي أخطاء برمجية أو نواقص في المتطلبات",
                "detail_en": "Corrections of code defects, runtime bugs, or incomplete agreed deliverables are handled immediately at zero cost.",
                "detail_ar": "معالجة أي أخطاء برمجية أو استكمال أي متطلبات متفق عليها تتم فوراً وبشكل مجاني بالكامل.",
            },
            {
                "id": "continuous-followup",
                "title_en": "Continuous Follow-Up Until Final Approval",
                "title_ar": "متابعة مستمرة حتى استلام المشروع واعتماده النهائي",
                "detail_en": "Our engineers remain actively engaged with you until every agreed requirement is verified and your deliverable is approved.",
                "detail_ar": "يبقى فريقنا الهندسي معك خطوة بخطوة حتى اكتمال كافة المتطلبات المتفق عليها واعتماد المخرجات النهائية.",
            },
            {
                "id": "transparent-scope",
                "title_en": "Transparent Scope Expansion Rules",
                "title_ar": "شفافية كاملة عند طلب إضافات جديدة خارج الاتفاق",
                "detail_en": "Brand-new modules or architectural changes outside the initial agreement are quoted transparently before any extra work begins.",
                "detail_ar": "في حال طلب ميزات جديدة كلياً خارج الاتفاق الأولي، يتم تقديم تسعير واضح ومستقل قبل البدء بها.",
            },
            {
                "id": "ethical-integrity",
                "title_en": "Strict Engineering & Academic Integrity",
                "title_ar": "التزام صارم بالنزاهة الهندسية والأكاديمية",
                "detail_en": "We guarantee verifiable code execution, reproducible documentation, and walkthrough mentoring — never misleading grade promises.",
                "detail_ar": "نضمن كوداً قابلاً للتشغيل الفعلي وتوثيقاً علمياً دقيقاً وشرحاً كاملاً، ولا نقدم وعوداً مضللة بالدرجات الأكاديمية.",
            },
        ],
    }
