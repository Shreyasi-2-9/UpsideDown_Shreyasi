from sqlalchemy import Column, String, Float, Integer, JSON, DateTime, ForeignKey
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

class GroupBooking(Base):
    __tablename__ = "group_bookings"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    service_id = Column(String(50), ForeignKey("services.id"), nullable=False)
    service_name = Column(String(100), nullable=False)
    locality = Column(String(100), default="Koregaon Park")
    discount_percent = Column(Float, default=45.0)
    target_households = Column(Integer, default=15)
    joined_households = Column(JSON, default=list)  # [{"name": "...", "apt": "...", "joinedAt": "..."}]
    base_price = Column(Float, nullable=False)
    group_price = Column(Float, nullable=False)
    status = Column(String(30), default="active")  # active, completed, expired
    expires_in_days = Column(Integer, default=5)
    date_deadline = Column(String(50), default="24 Jun")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
