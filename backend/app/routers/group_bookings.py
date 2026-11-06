from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.db.session import get_db
from app.models.group_booking import GroupBooking
from app.models.user import User
from app.schemas.group_booking import GroupBookingCreate, GroupBookingResponse, JoinGroupRequest
from app.routers.deps import get_current_user_optional

router = APIRouter(prefix="/group-bookings", tags=["Group Bookings"])

def serialize_group(g: GroupBooking) -> dict:
    return {
        "id": g.id,
        "neighbourhood": g.locality,
        "serviceId": g.service_id,
        "serviceName": g.service_name,
        "discountPercentage": g.discount_percent,
        "targetHouseholds": g.target_households,
        "joinedHouseholds": g.joined_households or [],
        "expiresInDays": g.expires_in_days,
        "dateDeadline": g.date_deadline,
        "basePrice": g.base_price,
        "groupPrice": g.group_price
    }

@router.get("", response_model=List[dict])
def get_group_bookings(
    locality: Optional[str] = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(GroupBooking).filter(GroupBooking.status == "active")
    if locality:
        query = query.filter(GroupBooking.locality.ilike(f"%{locality}%"))
    groups = query.all()
    return [serialize_group(g) for g in groups]

@router.post("", response_model=dict)
def create_group_booking(
    req: GroupBookingCreate,
    db: Session = Depends(get_db)
):
    new_group = GroupBooking(
        service_id=req.serviceId,
        service_name=f"{req.serviceId.capitalize()} Group Pool",
        locality=req.locality,
        discount_percent=req.discountPercentage,
        target_households=req.targetHouseholds,
        joined_households=[],
        base_price=req.basePrice,
        group_price=req.groupPrice
    )
    db.add(new_group)
    db.commit()
    return serialize_group(new_group)

@router.post("/{group_id}/join", response_model=dict)
def join_group_booking(
    group_id: str,
    req: JoinGroupRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    group = db.query(GroupBooking).filter(GroupBooking.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group booking not found")

    user_name = req.name or (current_user.name if current_user else "Asha Sharma")
    user_apt = req.apt or "Flat 402, Tower B"

    households = list(group.joined_households or [])
    # Check if already joined
    if not any(h.get("name") == user_name for h in households):
        households.append({
            "name": user_name,
            "apt": user_apt,
            "joinedAt": "Just now"
        })
        group.joined_households = households
        db.commit()

    return serialize_group(group)
