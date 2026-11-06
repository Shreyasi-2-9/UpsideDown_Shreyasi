from sqlalchemy import Column, String, Boolean, Float, Integer, ForeignKey, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    role = Column(String(20), nullable=False, default="citizen")  # citizen, technician, admin
    name = Column(String(120), nullable=False)
    phone = Column(String(30), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    language = Column(String(10), default="en")  # en, hi, mr
    senior_mode = Column(Boolean, default=False)
    locality = Column(String(100), default="Koregaon Park")
    address = Column(Text, default="Flat 402, Ganga Carnation, Koregaon Park, Pune")
    city = Column(String(60), default="Pune")
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    technician_profile = relationship("TechnicianProfile", back_populates="user", uselist=False)
    citizen_bookings = relationship("Booking", back_populates="citizen", foreign_keys="Booking.citizen_id")
    technician_bookings = relationship("Booking", back_populates="technician", foreign_keys="Booking.technician_id")
    notifications = relationship("Notification", back_populates="user")
    sos_alerts = relationship("SOSAlert", back_populates="user")

class TechnicianProfile(Base):
    __tablename__ = "technician_profiles"

    id = Column(String(64), primary_key=True, default=gen_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), unique=True, nullable=False)
    skills = Column(JSON, default=list)  # ["Pipe leaks", "Taps", "Geyser fitting"]
    primary_service = Column(String(50), default="plumbing")
    rating = Column(Float, default=4.9)
    jobs_count = Column(Integer, default=0)
    experience_years = Column(Integer, default=5)
    starting_price = Column(Float, default=199.0)
    verified = Column(Boolean, default=True)
    id_verified = Column(Boolean, default=True)
    trust_score = Column(Integer, default=95)
    verification_status = Column(String(20), default="approved")  # approved, pending, rejected
    lat = Column(Float, default=18.5362)
    lng = Column(Float, default=73.8940)
    distance_km = Column(Float, default=1.2)
    eta_minutes = Column(Integer, default=18)
    online = Column(Boolean, default=True)
    about = Column(Text, default="Certified master technician with extensive civic track record.")
    photo = Column(String(255), default="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200")
    certificates = Column(JSON, default=list)
    portfolio = Column(JSON, default=list)
    bank_details = Column(JSON, default=dict)
    kyc_documents = Column(JSON, default=list)

    user = relationship("User", back_populates="technician_profile")
