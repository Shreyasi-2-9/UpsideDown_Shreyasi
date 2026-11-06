from pydantic import BaseModel
from typing import Optional

class ReviewCreate(BaseModel):
    rating: float
    comment: str
    photo: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str
    booking_id: str
    citizen_name: str
    technician_id: str
    rating: float
    comment: str
    date: str
