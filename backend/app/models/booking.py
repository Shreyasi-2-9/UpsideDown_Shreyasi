from sqlalchemy import Column, String, Float, Integer, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_booking_id() -> str:
    # Generates booking job code format HC-xxxx
    import random
    return f"HC-{random.randint(2800, 3999)}"

def gen_uuid() -> str:
    return str(uuid.uuid4())

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(50), primary_key=True, default=gen_booking_id)  # e.g. HC-2916
    citizen_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    technician_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    service_id = Column(String(50), ForeignKey("services.id"), nullable=False)
    service_name = Column(String(150), nullable=False)
    
    # Status lifecycle
    status = Column(String(50), default="request_submitted")
    
    citizen_name = Column(String(120), nullable=False)
    citizen_phone = Column(String(30), nullable=False)
    citizen_address = Column(Text, nullable=False)
    area = Column(String(100), default="Koregaon Park")
    issue_description = Column(Text, nullable=False)
    issue_photos = Column(JSON, default=list)
    urgency = Column(String(20), default="standard")
    scheduled_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    scheduled_date_str = Column(String(50), default="Tomorrow")
    scheduled_time_window = Column(String(50), default="2:00 PM – 4:00 PM")

    # Financials & Escrow
    locked_price = Column(Float, default=0.0)
    platform_fee = Column(Float, default=0.0)
    gst_amount = Column(Float, default=0.0)
    total_paid = Column(Float, default=0.0)
    payment_method = Column(String(60), nullable=True)

    # Evidence & Verification
    before_work_photos = Column(JSON, default=list)
    after_work_photos = Column(JSON, default=list)
    before_hash = Column(String(128), nullable=True)
    after_hash = Column(String(128), nullable=True)
    ai_verification = Column(JSON, nullable=True)
    warranty_active_until = Column(String(50), nullable=True)
    dispute_reason = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Specialized category extras
    garbage_details = Column(JSON, nullable=True)
    bodyguard_requirements = Column(JSON, nullable=True)

    # Relationships
    citizen = relationship("User", foreign_keys=[citizen_id], back_populates="citizen_bookings")
    technician = relationship("User", foreign_keys=[technician_id], back_populates="technician_bookings")
    quotes = relationship("Quote", back_populates="booking", cascade="all, delete-orphan")
    negotiations = relationship("Negotiation", back_populates="booking", cascade="all, delete-orphan")
    escrow = relationship("EscrowPayment", back_populates="booking", uselist=False, cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="booking", cascade="all, delete-orphan")
    evidences = relationship("Evidence", back_populates="booking", cascade="all, delete-orphan")
    review = relationship("Review", back_populates="booking", uselist=False, cascade="all, delete-orphan")


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    booking_id = Column(String(50), ForeignKey("bookings.id"), nullable=False)
    technician_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    original_price = Column(Float, nullable=False)
    warranty_days = Column(Integer, default=7)
    scope_note = Column(Text, default="Standard visit and repair with warranty.")
    status = Column(String(30), default="pending")  # pending, accepted, rejected, counter_offered
    label = Column(String(50), default="Best match")
    tag_color = Column(String(20), default="green")
    eta = Column(String(30), default="18 min")
    distance_km = Column(Float, default=1.2)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    booking = relationship("Booking", back_populates="quotes")
    technician = relationship("User")


class Negotiation(Base):
    __tablename__ = "negotiations"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    booking_id = Column(String(50), ForeignKey("bookings.id"), nullable=False)
    offered_by = Column(String(64), ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(30), default="pending")  # pending, accepted, rejected
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    booking = relationship("Booking", back_populates="negotiations")
    offered_by_user = relationship("User")
