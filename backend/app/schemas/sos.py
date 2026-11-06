from pydantic import BaseModel
from typing import Optional

class SOSCreate(BaseModel):
    category: str = "medical"
    lat: Optional[float] = 18.5362
    lng: Optional[float] = 73.8940
    location: Optional[str] = "Koregaon Park, Pune"
    description: Optional[str] = None
    notes: Optional[str] = None

class SOSResponse(BaseModel):
    id: str
    citizenName: str
    citizenPhone: str
    location: str
    latitude: float
    longitude: float
    timestamp: str
    status: str
    category: str
    description: Optional[str] = None
    assignedStaff: Optional[str] = None
