from pydantic import BaseModel
from typing import Optional, List

class EvidenceCreate(BaseModel):
    file_url: str
    type: str  # before, after
    sha256_hash: Optional[str] = None

class EvidenceResponse(BaseModel):
    id: str
    booking_id: str
    file_url: str
    type: str
    sha256_hash: Optional[str] = None
    created_at: str

class AiVerificationResponse(BaseModel):
    booking_id: str
    confidence: float
    verdict: str
    checks: List[dict]
