from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    role_target = Column(String(20), default="all")  # all, citizen, technician, admin
    title = Column(String(150), nullable=False)
    body = Column(Text, nullable=False)
    type = Column(String(30), default="booking")  # booking, quotation, payment, sos, verification, review
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")
