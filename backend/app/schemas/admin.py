from pydantic import BaseModel
from typing import List, Dict, Any

class AdminStatsResponse(BaseModel):
    total_citizens: int
    total_technicians: int
    verified_technicians: int
    pending_verifications: int
    total_bookings: int
    active_escrows: int
    total_escrow_amount: float
    active_sos: int
    resolved_disputes: int

class TechnicianVerifyRequest(BaseModel):
    status: str  # approved, rejected
    reason: str = ""
