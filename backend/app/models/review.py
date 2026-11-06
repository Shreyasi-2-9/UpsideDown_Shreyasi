from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    booking_id = Column(String(50), ForeignKey("bookings.id"), unique=True, nullable=False)
    citizen_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    technician_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)
    photo_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    booking = relationship("Booking", back_populates="review")
    citizen = relationship("User", foreign_keys=[citizen_id])
    technician = relationship("User", foreign_keys=[technician_id])
