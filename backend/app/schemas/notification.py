from pydantic import BaseModel
from typing import Optional

class NotificationResponse(BaseModel):
    id: str
    title: str
    body: str
    timestamp: str
    read: bool
    roleTarget: str
    type: str

class NotificationMarkRead(BaseModel):
    read: bool = True
