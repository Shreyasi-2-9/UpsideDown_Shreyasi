from pydantic import BaseModel
from typing import List, Optional

class JoinedHousehold(BaseModel):
    name: str
    apt: str
    joinedAt: str

class GroupBookingCreate(BaseModel):
    serviceId: str
    locality: str
    discountPercentage: float = 45.0
    targetHouseholds: int = 15
    basePrice: float
    groupPrice: float

class GroupBookingResponse(BaseModel):
    id: str
    neighbourhood: str
    serviceId: str
    serviceName: str
    discountPercentage: float
    targetHouseholds: int
    joinedHouseholds: List[JoinedHousehold]
    expiresInDays: int
    dateDeadline: str
    basePrice: float
    groupPrice: float

class JoinGroupRequest(BaseModel):
    name: Optional[str] = None
    apt: Optional[str] = None
