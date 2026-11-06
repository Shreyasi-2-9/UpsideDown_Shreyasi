from sqlalchemy import Column, String, Float, Integer, Text, JSON
from app.db.session import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(String(50), primary_key=True)  # plumbing, electrical, ac_repair, etc.
    name = Column(String(100), nullable=False)
    name_hi = Column(String(100), nullable=False)
    name_mr = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=False)
    base_price = Column(Float, nullable=False)
    local_min = Column(Float, nullable=False)        # e.g. 300
    local_max = Column(Float, nullable=False)        # e.g. 420 (cap)
    benchmark_price = Column(Float, nullable=False)  # e.g. 340
    similar_jobs_count = Column(Integer, default=186)
    duration = Column(String(50), default="45-60 min")
    available_techs = Column(Integer, default=12)
    tags = Column(JSON, default=list)
