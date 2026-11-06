from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.models.booking import Booking, Quote, Negotiation
from app.models.user import User
from app.models.notification import Notification
from app.schemas.negotiation import CounterOfferRequest, CounterOfferResponse, NegotiationActionResponse
from app.services.negotiation_service import validate_counter_offer
from app.routers.deps import get_current_user_optional, get_language
from app.core.i18n import get_message

router = APIRouter(tags=["Negotiation"])

@router.post("/bookings/{booking_id}/counter-offer", response_model=CounterOfferResponse)
def create_counter_offer(
    booking_id: str,
    req: CounterOfferRequest,
    accept_language: Optional[str] = Header(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    lang = get_language(accept_language)
    
    # 1. Validate business rules: local_min <= amount <= local_max, booking not locked
    service = validate_counter_offer(db, booking_id, req.amount, lang=lang)
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    # User making the offer
    user_id = current_user.id if current_user else booking.citizen_id
    
    # Create negotiation record
    negotiation = Negotiation(
        booking_id=booking_id,
        offered_by=user_id,
        amount=req.amount,
        status="pending"
    )
    db.add(negotiation)

    # Update active quote or first quote with counter-offer
    quote = None
    if req.quote_id:
        quote = db.query(Quote).filter(Quote.id == req.quote_id).first()
    if not quote and booking.quotes:
        quote = booking.quotes[0]
        
    if quote:
        quote.amount = req.amount
        quote.status = "counter_offered"

    booking.status = "negotiating"

    # Send notification to technician
    if booking.technician_id:
        notif = Notification(
            user_id=booking.technician_id,
            role_target="technician",
            title=f"Counter-offer: ₹{int(req.amount)}",
            body=f"Citizen proposed ₹{int(req.amount)} for job #{booking.id}.",
            type="quotation"
        )
        db.add(notif)

    db.commit()

    return CounterOfferResponse(
        booking_id=booking_id,
        quote_id=quote.id if quote else None,
        amount=req.amount,
        status="counter_offered",
        message=get_message("counter_offer_sent", lang=lang, amount=int(req.amount))
    )

@router.post("/negotiations/{negotiation_id}/accept", response_model=NegotiationActionResponse)
def accept_negotiation(
    negotiation_id: str,
    accept_language: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    neg = db.query(Negotiation).filter(Negotiation.id == negotiation_id).first()
    if not neg:
        raise HTTPException(status_code=404, detail="Negotiation not found")

    neg.status = "accepted"
    booking = db.query(Booking).filter(Booking.id == neg.booking_id).first()
    if booking:
        booking.locked_price = neg.amount
        booking.status = "quotation_accepted"
    db.commit()

    return NegotiationActionResponse(
        negotiation_id=negotiation_id,
        booking_id=neg.booking_id,
        status="accepted",
        message="Counter-offer accepted successfully."
    )

@router.post("/negotiations/{negotiation_id}/reject", response_model=NegotiationActionResponse)
def reject_negotiation(
    negotiation_id: str,
    db: Session = Depends(get_db)
):
    neg = db.query(Negotiation).filter(Negotiation.id == negotiation_id).first()
    if not neg:
        raise HTTPException(status_code=404, detail="Negotiation not found")

    neg.status = "rejected"
    db.commit()

    return NegotiationActionResponse(
        negotiation_id=negotiation_id,
        booking_id=neg.booking_id,
        status="rejected",
        message="Counter-offer rejected."
    )
