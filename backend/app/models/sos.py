from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    citizen_name = Column(String(120), nullable=False)
    citizen_phone = Column(String(30), nullable=False)
    lat = Column(Float, default=18.5362)
    lng = Column(Float, default=73.8940)
    location = Column(String(200), default="Koregaon Park, Pune")
    category = Column(String(50), default="medical")  # medical, electrical, gas, fire, flooding
    description = Column(Text, nullable=True)
    status = Column(String(30), default="active")  # active, dispatched, resolved
    notes = Column(Text, nullable=True)
    assigned_staff = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="sos_alerts")
