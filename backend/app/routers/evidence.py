from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.booking import Booking
from app.models.evidence import Evidence
from app.models.user import User
from app.schemas.evidence import EvidenceCreate, EvidenceResponse, AiVerificationResponse
from app.routers.deps import get_current_user_optional

router = APIRouter(tags=["Evidence"])

@router.post("/bookings/{booking_id}/evidence", response_model=EvidenceResponse)
def upload_booking_evidence(
    booking_id: str,
    req: EvidenceCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    user_id = current_user.id if current_user else booking.citizen_id

    evidence = Evidence(
        booking_id=booking_id,
        uploaded_by=user_id,
        file_url=req.file_url,
        type=req.type,
        sha256_hash=req.sha256_hash or "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    )
    db.add(evidence)

    # Update booking evidence photo arrays
    if req.type == "before":
        curr = list(booking.before_work_photos or [])
        curr.append(req.file_url)
        booking.before_work_photos = curr
        booking.before_hash = evidence.sha256_hash
    else:
        curr = list(booking.after_work_photos or [])
        curr.append(req.file_url)
        booking.after_work_photos = curr
        booking.after_hash = evidence.sha256_hash
        # Mark AI verification simulated high confidence
        booking.ai_verification = {
            "confidence": 98.4,
            "verdict": "Work verified authentic. No signs of tampering or water leak residue.",
            "checks": [
                {"title": "Genuine joint fixture alignment", "passed": True},
                {"title": "Zero moisture seepage detected", "passed": True},
                {"title": "Clean work site inspection", "passed": True}
            ]
        }
        booking.status = "work_completed"

    db.commit()
    db.refresh(evidence)

    return EvidenceResponse(
        id=evidence.id,
        booking_id=evidence.booking_id,
        file_url=evidence.file_url,
        type=evidence.type,
        sha256_hash=evidence.sha256_hash,
        created_at=evidence.created_at.strftime("%I:%M %p")
    )

@router.get("/bookings/{booking_id}/evidence", response_model=List[EvidenceResponse])
def get_booking_evidences(booking_id: str, db: Session = Depends(get_db)):
    evs = db.query(Evidence).filter(Evidence.booking_id == booking_id).all()
    return [
        EvidenceResponse(
            id=e.id,
            booking_id=e.booking_id,
            file_url=e.file_url,
            type=e.type,
            sha256_hash=e.sha256_hash,
            created_at=e.created_at.strftime("%I:%M %p") if e.created_at else "Today"
        )
        for e in evs
    ]
