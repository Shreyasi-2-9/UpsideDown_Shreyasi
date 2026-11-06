from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any

class TechnicianMatchResponse(BaseModel):
    id: str
    name: str
    phone: str
    photo: str
    rating: float
    totalJobs: int = Field(alias="jobs_count")
    experienceYears: int = Field(alias="experience_years")
    primaryService: str = Field(alias="primary_service")
    skills: List[str]
    startingPrice: float = Field(alias="starting_price")
    isVerified: bool = Field(alias="verified")
    trustScore: int = Field(alias="trust_score")
    distanceKm: float = Field(alias="distance_km")
    etaMinutes: int = Field(alias="eta_minutes")
    isOnline: bool = Field(alias="online")
    about: str

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

class SkillPassportResponse(BaseModel):
    id: str
    name: str
    phone: str
    photo: str
    rating: float
    totalJobs: int
    experienceYears: int
    trustScore: int
    primaryService: str
    skills: List[str]
    isVerified: bool
    verificationStatus: str
    about: str
    certificates: List[Dict[str, Any]]
    portfolio: List[Dict[str, Any]]
    reviews: List[Dict[str, Any]]
    kycDocuments: Optional[List[Dict[str, Any]]] = None
    bankDetails: Optional[Dict[str, Any]] = None

class LocationUpdate(BaseModel):
    lat: float
    lng: float
