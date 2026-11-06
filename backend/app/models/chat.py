from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    booking_id = Column(String(50), ForeignKey("bookings.id"), nullable=False)
    sender_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    sender_role = Column(String(20), nullable=False)  # citizen, technician, system
    sender_name = Column(String(120), nullable=True)
    text = Column(Text, nullable=False)
    photo_url = Column(String(255), nullable=True)
    status = Column(String(20), default="delivered")  # sent, delivered, read
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    booking = relationship("Booking", back_populates="chat_messages")
