from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.user import User, TechnicianProfile
from app.schemas.technician import TechnicianMatchResponse, SkillPassportResponse, LocationUpdate
from app.services.matching_service import match_technicians
from app.routers.deps import get_current_user, require_role

router = APIRouter(prefix="/technicians", tags=["Technicians"])

@router.get("/match", response_model=List[TechnicianMatchResponse])
def get_matched_technicians(
    service_id: str = Query(...),
    lat: Optional[float] = Query(default=18.5362),
    lng: Optional[float] = Query(default=73.8940),
    db: Session = Depends(get_db)
):
    results = match_technicians(db, service_id=service_id, user_lat=lat, user_lng=lng)
    return [
        TechnicianMatchResponse(
            id=r["id"],
            name=r["name"],
            phone=r["phone"],
            photo=r["photo"],
            jobs_count=r["jobs_count"],
            rating=r["rating"],
            experience_years=r["experience_years"],
            primary_service=r["primary_service"],
            skills=r["skills"],
            starting_price=r["starting_price"],
            verified=r["verified"],
            trust_score=r["trust_score"],
            distance_km=r["distance_km"],
            eta_minutes=r["eta_minutes"],
            online=r["online"],
            about=r["about"]
        )
        for r in results
    ]

@router.get("/{tech_id}/skill-passport", response_model=SkillPassportResponse)
def get_skill_passport(tech_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == tech_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Technician not found")
    
    tp = user.technician_profile
    if not tp:
        raise HTTPException(status_code=404, detail="Technician profile not found")

    return SkillPassportResponse(
        id=user.id,
        name=user.name,
        phone=user.phone,
        photo=tp.photo,
        rating=tp.rating,
        totalJobs=tp.jobs_count,
        experienceYears=tp.experience_years,
        trustScore=tp.trust_score,
        primaryService=tp.primary_service,
        skills=tp.skills or [],
        isVerified=tp.verified,
        verificationStatus=tp.verification_status,
        about=tp.about,
        certificates=tp.certificates or [],
        portfolio=tp.portfolio or [],
        reviews=[
            {
                "id": "rev-1",
                "citizenName": "Asha Sharma",
                "rating": 5.0,
                "comment": "Ramesh fixed our leaking pipe within 30 minutes! Very respectful and polite.",
                "date": "18 Jun 2025",
                "serviceName": "Plumbing"
            }
        ],
        kycDocuments=tp.kyc_documents or [],
        bankDetails=tp.bank_details or {}
    )

@router.get("/{tech_id}", response_model=TechnicianMatchResponse)
def get_technician_by_id(tech_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == tech_id).first()
    if not user or not user.technician_profile:
        raise HTTPException(status_code=404, detail="Technician not found")
    tp = user.technician_profile
    return TechnicianMatchResponse(
        id=user.id,
        name=user.name,
        phone=user.phone,
        photo=tp.photo,
        jobs_count=tp.jobs_count,
        rating=tp.rating,
        experience_years=tp.experience_years,
        primary_service=tp.primary_service,
        skills=tp.skills or [],
        starting_price=tp.starting_price,
        verified=tp.verified,
        trust_score=tp.trust_score,
        distance_km=tp.distance_km,
        eta_minutes=tp.eta_minutes,
        online=tp.online,
        about=tp.about
    )

@router.patch("/me/location")
def update_technician_location(
    loc: LocationUpdate,
    current_user: User = Depends(require_role(["technician"])),
    db: Session = Depends(get_db)
):
    tp = current_user.technician_profile
    if tp:
        tp.lat = loc.lat
        tp.lng = loc.lng
        db.commit()
    return {"status": "success", "lat": loc.lat, "lng": loc.lng}
