from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.sos import SOSAlert
from app.models.user import User
from app.schemas.sos import SOSCreate, SOSResponse
from app.routers.deps import get_current_user_optional, get_language
from app.core.i18n import get_message

router = APIRouter(prefix="/sos", tags=["SOS Emergency"])

@router.post("", response_model=SOSResponse)
def trigger_sos(
    req: SOSCreate,
    accept_language: Optional[str] = Header(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    lang = get_language(accept_language)
    citizen_name = current_user.name if current_user else "Asha Sharma"
    citizen_phone = current_user.phone if current_user else "+91 98221 12345"
    user_id = current_user.id if current_user else (db.query(User).filter(User.role == "citizen").first().id)

    sos = SOSAlert(
        user_id=user_id,
        citizen_name=citizen_name,
        citizen_phone=citizen_phone,
        lat=req.lat or 18.5362,
        lng=req.lng or 73.8940,
        location=req.location or "Koregaon Park, Pune",
        category=req.category,
        description=req.description or f"Emergency assistance requested for {req.category}.",
        notes=req.notes,
        status="active"
    )
    db.add(sos)
    db.commit()
    db.refresh(sos)

    return SOSResponse(
        id=sos.id,
        citizenName=sos.citizen_name,
        citizenPhone=sos.citizen_phone,
        location=sos.location,
        latitude=sos.lat,
        longitude=sos.lng,
        timestamp="Just now",
        status=sos.status,
        category=sos.category,
        description=sos.description,
        assignedStaff="PMC Civic Rapid Unit #04"
    )

@router.get("", response_model=List[SOSResponse])
def list_sos_alerts(db: Session = Depends(get_db)):
    alerts = db.query(SOSAlert).order_by(SOSAlert.created_at.desc()).all()
    return [
        SOSResponse(
            id=a.id,
            citizenName=a.citizen_name,
            citizenPhone=a.citizen_phone,
            location=a.location,
            latitude=a.lat,
            longitude=a.lng,
            timestamp=a.created_at.strftime("%I:%M %p") if a.created_at else "Just now",
            status=a.status,
            category=a.category,
            description=a.description,
            assignedStaff=a.assigned_staff or "PMC Rapid Unit #04"
        )
        for a in alerts
    ]
