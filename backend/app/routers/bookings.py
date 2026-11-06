from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import random
from app.db.session import get_db
from app.models.booking import Booking, Quote, Negotiation
from app.models.service import Service
from app.models.user import User, TechnicianProfile
from app.models.notification import Notification
from app.schemas.booking import BookingCreate, BookingResponse, BookingStatusUpdate, QuotationSchema, ChatMessageSchema
from app.routers.deps import get_current_user, get_current_user_optional, require_role

router = APIRouter(prefix="/bookings", tags=["Bookings"])

def serialize_booking(b: Booking, db: Session) -> dict:
    quotes_out = []
    for q in b.quotes:
        t_user = db.query(User).filter(User.id == q.technician_id).first()
        t_prof = t_user.technician_profile if t_user else None
        quotes_out.append({
            "id": q.id,
            "technicianId": q.technician_id,
            "technicianName": t_user.name if t_user else "Technician",
            "technicianRating": t_prof.rating if t_prof else 4.9,
            "technicianJobs": t_prof.jobs_count if t_prof else 120,
            "technicianPhoto": t_prof.photo if t_prof else "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
            "originalPrice": q.original_price,
            "currentPrice": q.amount,
            "status": q.status,
            "counterPrice": q.amount if q.status == "counter_offered" else None,
            "eta": q.eta,
            "distanceKm": q.distance_km,
            "scopeNote": q.scope_note,
            "warrantyDays": q.warranty_days,
            "label": q.label or "Best match",
            "tagColor": q.tag_color or "green"
        })

    chat_out = []
    for m in b.chat_messages:
        chat_out.append({
            "id": m.id,
            "sender": m.sender_role,
            "senderName": m.sender_name,
            "text": m.text,
            "timestamp": m.created_at.strftime("%I:%M %p") if m.created_at else "Just now",
            "status": m.status,
            "photoUrl": m.photo_url
        })

    tech_user = db.query(User).filter(User.id == b.technician_id).first() if b.technician_id else None
    tech_prof = tech_user.technician_profile if tech_user else None

    return {
        "id": b.id,
        "serviceId": b.service_id,
        "serviceName": b.service_name,
        "citizenName": b.citizen_name,
        "citizenPhone": b.citizen_phone,
        "citizenAddress": b.citizen_address,
        "area": b.area,
        "issueDescription": b.issue_description,
        "issuePhotos": b.issue_photos or [],
        "urgency": b.urgency,
        "scheduledDate": b.scheduled_date_str,
        "scheduledTimeWindow": b.scheduled_time_window,
        "status": b.status,
        "technicianId": b.technician_id,
        "technicianName": tech_user.name if tech_user else (quotes_out[0]["technicianName"] if quotes_out else None),
        "technicianPhone": tech_user.phone if tech_user else "+91 98221 44021",
        "technicianPhoto": tech_prof.photo if tech_prof else (quotes_out[0]["technicianPhoto"] if quotes_out else None),
        "technicianRating": tech_prof.rating if tech_prof else (quotes_out[0]["technicianRating"] if quotes_out else 4.9),
        "lockedPrice": b.locked_price,
        "platformFee": b.platform_fee,
        "gstAmount": b.gst_amount,
        "totalPaid": b.total_paid,
        "paymentMethod": b.payment_method,
        "createdAt": b.created_at.strftime("%b %d, %Y") if b.created_at else "Today",
        "quotations": quotes_out,
        "chatMessages": chat_out,
        "beforeWorkPhotos": b.before_work_photos or [],
        "afterWorkPhotos": b.after_work_photos or [],
        "beforeHash": b.before_hash,
        "afterHash": b.after_hash,
        "aiVerification": b.ai_verification,
        "warrantyActiveUntil": b.warranty_active_until,
        "disputeReason": b.dispute_reason,
        "garbageDetails": b.garbage_details,
        "bodyguardRequirements": b.bodyguard_requirements
    }

@router.post("", response_model=dict)
def create_booking(
    req: BookingCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    # If unauthenticated, use or create demo citizen
    if not current_user:
        current_user = db.query(User).filter(User.role == "citizen").first()

    service = db.query(Service).filter(Service.id == req.serviceId).first()
    service_title = req.serviceName or (f"{service.name} · Service Request" if service else "HomeCare Service")

    # Match a verified technician for this service
    tech_prof = db.query(TechnicianProfile).join(User).filter(
        TechnicianProfile.primary_service == req.serviceId,
        TechnicianProfile.online == True
    ).first()
    
    if not tech_prof:
        tech_prof = db.query(TechnicianProfile).first()

    tech_user = tech_prof.user if tech_prof else None

    # Calculate initial quote amount
    base_price = req.lockedPrice or (service.base_price if service else 199.0)
    original_price = base_price + 100.0

    booking_id = f"HC-{random.randint(2850, 3999)}"

    new_booking = Booking(
        id=booking_id,
        citizen_id=current_user.id,
        technician_id=tech_user.id if tech_user else None,
        service_id=req.serviceId,
        service_name=service_title,
        citizen_name=current_user.name,
        citizen_phone=current_user.phone,
        citizen_address=req.citizenAddress or current_user.address,
        area=current_user.locality,
        issue_description=req.issueDescription,
        issue_photos=req.issuePhotos or [],
        urgency=req.urgency or "standard",
        scheduled_date_str=req.scheduledDate or "Tomorrow",
        scheduled_time_window=req.scheduledTimeWindow or "2:00 PM – 4:00 PM",
        status="request_submitted",
        locked_price=base_price,
        platform_fee=round(base_price * 0.05, 2),
        gst_amount=round((base_price + base_price * 0.05) * 0.18, 2),
        total_paid=round(base_price * 1.05 * 1.18, 2),
        garbage_details=req.garbageDetails,
        bodyguard_requirements=req.bodyguardRequirements
    )
    db.add(new_booking)
    db.commit()

    # Create initial Quote
    if tech_user:
        quote = Quote(
            booking_id=new_booking.id,
            technician_id=tech_user.id,
            amount=base_price,
            original_price=original_price,
            warranty_days=7,
            scope_note="Standard visit, complete problem diagnosis, and genuine parts warranty.",
            status="pending",
            label="Best match",
            tag_color="green",
            eta=f"{tech_prof.eta_minutes} min",
            distance_km=tech_prof.distance_km
        )
        db.add(quote)

        # Notify technician
        notif = Notification(
            user_id=tech_user.id,
            role_target="technician",
            title="New Job Request Available",
            body=f"New {req.serviceId} job #{booking_id} in {current_user.locality}.",
            type="booking"
        )
        db.add(notif)
        db.commit()

    return serialize_booking(new_booking, db)

@router.get("", response_model=List[dict])
def list_bookings(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Booking)
    # Role-based filtering if user is authenticated
    if current_user:
        if current_user.role == "citizen":
            query = query.filter(Booking.citizen_id == current_user.id)
        elif current_user.role == "technician":
            query = query.filter(Booking.technician_id == current_user.id)
        # admin gets all

    bookings = query.order_by(Booking.created_at.desc()).all()
    # Fallback if empty
    if not bookings:
        bookings = db.query(Booking).order_by(Booking.created_at.desc()).limit(10).all()

    return [serialize_booking(b, db) for b in bookings]

@router.get("/{booking_id}", response_model=dict)
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return serialize_booking(booking, db)

@router.patch("/{booking_id}/status", response_model=dict)
def update_booking_status(
    booking_id: str,
    status_update: BookingStatusUpdate,
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = status_update.status
    db.commit()
    return serialize_booking(booking, db)

@router.post("/{booking_id}/accept", response_model=dict)
def accept_booking(
    booking_id: str,
    body: Optional[dict] = None,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    tech_id = current_user.id if (current_user and current_user.role == "technician") else booking.technician_id
    if not tech_id:
        tech_prof = db.query(TechnicianProfile).first()
        tech_id = tech_prof.user_id if tech_prof else "tech-1"

    booking.status = "quotation_accepted"
    booking.technician_id = tech_id

    if body and "quote_price" in body and body["quote_price"]:
        try:
            booking.locked_price = float(body["quote_price"])
        except (ValueError, TypeError):
            pass

    for q in booking.quotes:
        if q.technician_id == tech_id or not booking.technician_id:
            q.status = "accepted"

    tech_user = db.query(User).filter(User.id == tech_id).first()
    tech_name = tech_user.name if tech_user else "Technician"
    notif = Notification(
        user_id=booking.citizen_id,
        role_target="citizen",
        title="Request Accepted by Technician!",
        body=f"{tech_name} has accepted your service request #{booking.id}. Proceed to review quote and lock price.",
        type="booking"
    )
    db.add(notif)
    db.commit()
    return serialize_booking(booking, db)
