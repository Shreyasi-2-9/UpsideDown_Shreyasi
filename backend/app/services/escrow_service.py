from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone
from app.models.booking import Booking
from app.models.escrow import EscrowPayment
from app.models.notification import Notification
from app.core.i18n import get_message

def lock_price_and_escrow(
    db: Session,
    booking_id: str,
    locked_amount: float,
    payment_method: str = "UPI (Auto-Escrow)",
    lang: str = "en"
) -> EscrowPayment:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    platform_fee = round(locked_amount * 0.05, 2)
    gst_amount = round((locked_amount + platform_fee) * 0.18, 2)
    total_paid = round(locked_amount + platform_fee + gst_amount, 2)

    booking.locked_price = locked_amount
    booking.platform_fee = platform_fee
    booking.gst_amount = gst_amount
    booking.total_paid = total_paid
    booking.status = "escrow_locked"
    booking.payment_method = payment_method

    # Create or update escrow payment record
    escrow = db.query(EscrowPayment).filter(EscrowPayment.booking_id == booking_id).first()
    if not escrow:
        escrow = EscrowPayment(
            booking_id=booking_id,
            amount=total_paid,
            status="held",
            payment_method=payment_method
        )
        db.add(escrow)
    else:
        escrow.amount = total_paid
        escrow.status = "held"
        escrow.payment_method = payment_method

    # Notify technician that job price is locked and escrow secured
    if booking.technician_id:
        notif = Notification(
            user_id=booking.technician_id,
            role_target="technician",
            title=f"Price Locked: ₹{locked_amount}",
            body=f"Citizen has locked price for job #{booking.id}. Funds are secured in HomeCare Escrow.",
            type="payment"
        )
        db.add(notif)

    db.commit()
    db.refresh(booking)
    db.refresh(escrow)
    return escrow

def release_escrow(
    db: Session,
    booking_id: str,
    user_id: str,
    lang: str = "en"
) -> EscrowPayment:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Business rule: Escrow release sirf citizen ke confirm karne ke baad
    if booking.citizen_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=get_message("escrow_release_unauthorized", lang=lang)
        )

    # Business rule: Must be work_completed
    if booking.status not in ["work_completed", "arrived", "work_started"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=get_message("work_not_completed", lang=lang)
        )

    escrow = db.query(EscrowPayment).filter(EscrowPayment.booking_id == booking_id).first()
    if not escrow:
        raise HTTPException(status_code=404, detail="No escrow deposit found for this booking")

    escrow.status = "released"
    escrow.released_at = datetime.now(timezone.utc)
    booking.status = "payment_released"
    booking.completed_at = datetime.now(timezone.utc)

    # Notify technician
    if booking.technician_id:
        notif = Notification(
            user_id=booking.technician_id,
            role_target="technician",
            title="Payment Released!",
            body=f"Citizen approved job #{booking.id}. ₹{escrow.amount} released to your bank account.",
            type="payment"
        )
        db.add(notif)

    db.commit()
    db.refresh(booking)
    db.refresh(escrow)
    return escrow
