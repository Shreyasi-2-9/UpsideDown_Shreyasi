from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List

class UserRegister(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    password: str
    role: str = "citizen"  # citizen, technician, admin
    language: str = "en"
    senior_mode: bool = False
    locality: str = "Koregaon Park"
    address: Optional[str] = "Flat 402, Ganga Carnation, Koregaon Park"

class UserLogin(BaseModel):
    phone_or_email: str
    password: str
    role: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    role: str
    language: str = "en"
    senior_mode: bool = False
    locality: str = "Koregaon Park"
    address: str
    city: str = "Pune"
    is_verified: bool = True
    joined_date: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
