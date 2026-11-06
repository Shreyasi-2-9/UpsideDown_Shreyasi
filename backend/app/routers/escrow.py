from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.models.booking import Booking, Quote
from app.models.escrow import EscrowPayment
from app.models.user import User
from app.schemas.booking import LockPriceRequest
from app.schemas.escrow import EscrowActionResponse
from app.services.escrow_service import lock_price_and_escrow, release_escrow
from app.routers.deps import get_current_user_optional, get_current_user, get_language
from app.core.i18n import get_message

router = APIRouter(tags=["Escrow & Lock Price"])

@router.post("/bookings/{booking_id}/lock-price", response_model=dict)
def lock_price_endpoint(
    booking_id: str,
    req: LockPriceRequest,
    accept_language: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    lang = get_language(accept_language)
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    target_quote = None
    if req.quoteId:
        target_quote = db.query(Quote).filter(Quote.id == req.quoteId).first()
    if not target_quote and booking.quotes:
        target_quote = booking.quotes[0]

    locked_amount = target_quote.amount if target_quote else (booking.locked_price or 340.0)
    
    # Execute escrow locking service
    escrow = lock_price_and_escrow(
        db,
        booking_id=booking_id,
        locked_amount=locked_amount,
        payment_method=req.paymentMethod or "UPI (Auto-Escrow)",
        lang=lang
    )

    tech_user = db.query(User).filter(User.id == booking.technician_id).first() if booking.technician_id else None
    tech_prof = tech_user.technician_profile if tech_user else None

    eta = f"{tech_prof.eta_minutes} min" if tech_prof else "18 min"
    tech_name = tech_user.name if tech_user else "Assigned Master"

    return {
        "booking_id": booking.id,
        "job_code": booking.id,
        "locked_price": booking.locked_price,
        "total_paid": booking.total_paid,
        "escrow_id": escrow.id,
        "escrow_status": escrow.status,
        "technician_name": tech_name,
        "technician_eta": eta,
        "message": get_message("price_locked", lang=lang, amount=int(booking.locked_price))
    }

@router.post("/bookings/{booking_id}/release", response_model=EscrowActionResponse)
def release_escrow_endpoint(
    booking_id: str,
    accept_language: Optional[str] = Header(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    lang = get_language(accept_language)
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # If demo/unauth, use booking citizen id
    user_id = current_user.id if current_user else booking.citizen_id

    escrow = release_escrow(db, booking_id=booking_id, user_id=user_id, lang=lang)

    return EscrowActionResponse(
        booking_id=booking_id,
        escrow_status=escrow.status,
        amount=escrow.amount,
        message=get_message("escrow_released", lang=lang)
    )

@router.post("/bookings/{booking_id}/refund", response_model=EscrowActionResponse)
def refund_escrow_endpoint(
    booking_id: str,
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    escrow = db.query(EscrowPayment).filter(EscrowPayment.booking_id == booking_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="No escrow deposit found")

    escrow.status = "refunded"
    booking.status = "cancelled"
    db.commit()

    return EscrowActionResponse(
        booking_id=booking_id,
        escrow_status="refunded",
        amount=escrow.amount,
        message="Escrow deposit successfully refunded to citizen."
    )
