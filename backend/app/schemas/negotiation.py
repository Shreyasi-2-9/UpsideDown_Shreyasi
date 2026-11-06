from pydantic import BaseModel
from typing import Optional

class CounterOfferRequest(BaseModel):
    quote_id: Optional[str] = None
    amount: float

class CounterOfferResponse(BaseModel):
    booking_id: str
    quote_id: Optional[str] = None
    amount: float
    status: str
    message: str

class NegotiationActionResponse(BaseModel):
    negotiation_id: str
    booking_id: str
    status: str
    message: str
