from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.booking import Booking, Quote, Negotiation
from app.models.service import Service
from app.core.i18n import get_message

def validate_counter_offer(
    db: Session,
    booking_id: str,
    amount: float,
    lang: str = "en"
) -> Service:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Business rule: Lock price ke baad amount change nahi ho sakta
    if booking.status in ["locked", "escrow_locked", "on_the_way", "arrived", "work_started", "work_completed", "payment_released"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Price is already locked and cannot be renegotiated."
        )

    service = db.query(Service).filter(Service.id == booking.service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    # Counter-offer must be between local_min and local_max
    if amount < service.local_min or amount > service.local_max:
        error_msg = get_message(
            "counter_invalid_range",
            lang=lang,
            min=int(service.local_min),
            max=int(service.local_max)
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )

    return service
