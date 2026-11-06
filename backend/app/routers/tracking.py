from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.booking import Booking
from app.models.user import User, TechnicianProfile

router = APIRouter(tags=["Tracking"])

@router.get("/bookings/{booking_id}/tracking")
def get_booking_tracking(booking_id: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    tech_user = db.query(User).filter(User.id == booking.technician_id).first() if booking.technician_id else None
    tech_prof = tech_user.technician_profile if tech_user else None

    lat = tech_prof.lat if tech_prof else 18.5362
    lng = tech_prof.lng if tech_prof else 73.8940
    eta = tech_prof.eta_minutes if tech_prof else 12

    return {
        "booking_id": booking.id,
        "status": booking.status,
        "technician": {
            "id": tech_user.id if tech_user else "tech-1",
            "name": tech_user.name if tech_user else "Ramesh Patil",
            "phone": tech_user.phone if tech_user else "+91 98221 44021",
            "photo": tech_prof.photo if tech_prof else "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
            "rating": tech_prof.rating if tech_prof else 4.9,
            "jobs_count": tech_prof.jobs_count if tech_prof else 429
        },
        "location": {
            "latitude": lat,
            "longitude": lng,
            "area": "North Main Rd → Lane 5, Koregaon Park",
            "traffic": "Smooth"
        },
        "eta_minutes": eta,
        "distance_km": tech_prof.distance_km if tech_prof else 1.2
    }
