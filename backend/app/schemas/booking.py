from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any

class QuotationSchema(BaseModel):
    id: str
    technicianId: str
    technicianName: str
    technicianRating: float
    technicianJobs: int
    technicianPhoto: str
    originalPrice: float
    currentPrice: float
    status: str
    counterPrice: Optional[float] = None
    eta: str
    distanceKm: float
    scopeNote: str
    warrantyDays: int
    label: Optional[str] = "Best match"
    tagColor: Optional[str] = "green"

class ChatMessageSchema(BaseModel):
    id: str
    sender: str
    senderName: Optional[str] = None
    text: str
    timestamp: str
    status: Optional[str] = "delivered"
    photoUrl: Optional[str] = None

class BookingCreate(BaseModel):
    serviceId: str
    serviceName: Optional[str] = None
    issueDescription: str
    issuePhotos: Optional[List[str]] = []
    urgency: Optional[str] = "standard"
    scheduledDate: Optional[str] = "Tomorrow"
    scheduledTimeWindow: Optional[str] = "2:00 PM – 4:00 PM"
    citizenAddress: Optional[str] = None
    lockedPrice: Optional[float] = None
    garbageDetails: Optional[Dict[str, Any]] = None
    bodyguardRequirements: Optional[Dict[str, Any]] = None

class BookingResponse(BaseModel):
    id: str
    serviceId: str
    serviceName: str
    citizenName: str
    citizenPhone: str
    citizenAddress: str
    area: str
    issueDescription: str
    issuePhotos: List[str]
    urgency: str
    scheduledDate: str
    scheduledTimeWindow: str
    status: str
    technicianId: Optional[str] = None
    technicianName: Optional[str] = None
    technicianPhone: Optional[str] = None
    technicianPhoto: Optional[str] = None
    technicianRating: Optional[float] = None
    lockedPrice: float
    platformFee: float
    gstAmount: float
    totalPaid: float
    paymentMethod: Optional[str] = None
    createdAt: str
    quotations: List[QuotationSchema] = []
    chatMessages: List[ChatMessageSchema] = []
    beforeWorkPhotos: Optional[List[str]] = []
    afterWorkPhotos: Optional[List[str]] = []
    beforeHash: Optional[str] = None
    afterHash: Optional[str] = None
    aiVerification: Optional[Dict[str, Any]] = None
    warrantyActiveUntil: Optional[str] = None
    disputeReason: Optional[str] = None
    garbageDetails: Optional[Dict[str, Any]] = None
    bodyguardRequirements: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(populate_by_name=True)

class BookingStatusUpdate(BaseModel):
    status: str

class LockPriceRequest(BaseModel):
    quoteId: Optional[str] = None
    paymentMethod: Optional[str] = "UPI (Auto-Escrow)"
