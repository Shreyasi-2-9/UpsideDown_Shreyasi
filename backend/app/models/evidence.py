from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    booking_id = Column(String(50), ForeignKey("bookings.id"), nullable=False)
    uploaded_by = Column(String(64), ForeignKey("users.id"), nullable=False)
    file_url = Column(String(255), nullable=False)
    type = Column(String(20), nullable=False)  # before, after
    sha256_hash = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    booking = relationship("Booking", back_populates="evidences")
    uploader = relationship("User")
