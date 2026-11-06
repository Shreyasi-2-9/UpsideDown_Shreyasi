from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

class EscrowPayment(Base):
    __tablename__ = "escrow_payments"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    booking_id = Column(String(50), ForeignKey("bookings.id"), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(30), default="held")  # held, released, refunded
    payment_method = Column(String(60), default="UPI")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    released_at = Column(DateTime, nullable=True)

    booking = relationship("Booking", back_populates="escrow")
