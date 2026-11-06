from pydantic import BaseModel
from typing import Optional

class ChatMessageCreate(BaseModel):
    sender: str = "citizen"  # citizen, technician, system
    senderName: Optional[str] = None
    text: str
    photoUrl: Optional[str] = None

class ChatMessageOut(BaseModel):
    id: str
    booking_id: str
    sender: str
    senderName: Optional[str] = None
    text: str
    timestamp: str
    status: str = "delivered"
    photoUrl: Optional[str] = None
