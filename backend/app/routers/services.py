from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.service import Service
from app.schemas.service import ServiceResponse, BenchmarkResponse

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("", response_model=List[ServiceResponse])
def get_services(db: Session = Depends(get_db)):
    services = db.query(Service).all()
    # Map to schema
    return [
        ServiceResponse(
            id=s.id,
            name=s.name,
            name_hi=s.name_hi,
            name_mr=s.name_mr,
            description=s.description,
            icon=s.icon,
            base_price=s.base_price,
            duration=s.duration,
            available_techs=s.available_techs,
            tags=s.tags or []
        )
        for s in services
    ]

@router.get("/{service_id}/benchmark", response_model=BenchmarkResponse)
def get_service_benchmark(
    service_id: str,
    locality: str = Query(default="Koregaon Park"),
    db: Session = Depends(get_db)
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        # Fallback to plumbing
        service = db.query(Service).filter(Service.id == "plumbing").first()
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")

    return BenchmarkResponse(
        service_id=service.id,
        service_name=service.name,
        locality=locality,
        local_min=service.local_min,
        local_max=service.local_max,
        benchmark_price=service.benchmark_price,
        discount_price=service.local_min,
        similar_jobs_count=service.similar_jobs_count,
        recommendation_note=f"₹{service.benchmark_price} aligns with {service.similar_jobs_count} similar {service.name.lower()} jobs in {locality}."
    )
