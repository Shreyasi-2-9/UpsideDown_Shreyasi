from pydantic import BaseModel
from typing import Optional

class EscrowActionResponse(BaseModel):
    booking_id: str
    escrow_status: str
    amount: float
    message: str
