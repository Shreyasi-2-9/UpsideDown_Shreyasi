from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.user import User, TechnicianProfile
from app.models.booking import Booking
from app.models.escrow import EscrowPayment
from app.models.sos import SOSAlert
from app.schemas.admin import AdminStatsResponse, TechnicianVerifyRequest
from app.routers.deps import require_role

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db)):
    total_citizens = db.query(User).filter(User.role == "citizen").count()
    total_technicians = db.query(User).filter(User.role == "technician").count()
    verified_techs = db.query(TechnicianProfile).filter(TechnicianProfile.verified == True).count()
    pending_techs = db.query(TechnicianProfile).filter(TechnicianProfile.verification_status == "pending").count()
    total_bookings = db.query(Booking).count()
    
    active_escrows_q = db.query(EscrowPayment).filter(EscrowPayment.status == "held").all()
    active_escrows_count = len(active_escrows_q)
    total_escrow_amt = sum(e.amount for e in active_escrows_q)
    
    active_sos = db.query(SOSAlert).filter(SOSAlert.status == "active").count()
    disputes = db.query(Booking).filter(Booking.status == "disputed").count()

    return AdminStatsResponse(
        total_citizens=total_citizens,
        total_technicians=total_technicians,
        verified_technicians=verified_techs,
        pending_verifications=pending_techs,
        total_bookings=total_bookings,
        active_escrows=active_escrows_count,
        total_escrow_amount=round(total_escrow_amt, 2),
        active_sos=active_sos,
        resolved_disputes=disputes
    )

@router.get("/technicians")
def list_technicians_for_admin(db: Session = Depends(get_db)):
    techs = db.query(TechnicianProfile).join(User).all()
    results = []
    for t in techs:
        results.append({
            "id": t.user.id,
            "name": t.user.name,
            "phone": t.user.phone,
            "primaryService": t.primary_service,
            "rating": t.rating,
            "totalJobs": t.jobs_count,
            "verificationStatus": t.verification_status,
            "isVerified": t.verified,
            "trustScore": t.trust_score
        })
    return results

@router.post("/technicians/{tech_id}/verify")
def verify_technician(
    tech_id: str,
    req: TechnicianVerifyRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == tech_id).first()
    if not user or not user.technician_profile:
        raise HTTPException(status_code=404, detail="Technician not found")

    tp = user.technician_profile
    tp.verification_status = req.status
    tp.verified = (req.status == "approved")
    db.commit()

    return {
        "status": "success",
        "technician_id": tech_id,
        "verification_status": tp.verification_status,
        "is_verified": tp.verified
    }

@router.get("/disputes")
def list_disputes(db: Session = Depends(get_db)):
    disputed_bookings = db.query(Booking).filter(Booking.status == "disputed").all()
    return [
        {
            "booking_id": b.id,
            "service": b.service_name,
            "citizen_name": b.citizen_name,
            "citizen_phone": b.citizen_phone,
            "dispute_reason": b.dispute_reason or "Customer dissatisfied with work quality or timing.",
            "total_paid": b.total_paid,
            "created_at": b.created_at.strftime("%b %d, %Y") if b.created_at else "Today"
        }
        for b in disputed_bookings
    ]
