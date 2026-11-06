from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.booking import Booking
from app.models.review import Review
from app.models.user import User, TechnicianProfile
from app.schemas.review import ReviewCreate, ReviewResponse
from app.routers.deps import get_current_user_optional

router = APIRouter(tags=["Reviews"])

@router.post("/bookings/{booking_id}/review", response_model=ReviewResponse)
def submit_booking_review(
    booking_id: str,
    req: ReviewCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    citizen_id = current_user.id if current_user else booking.citizen_id
    technician_id = booking.technician_id
    if not technician_id:
        tech_prof = db.query(TechnicianProfile).first()
        technician_id = tech_prof.user_id if tech_prof else citizen_id

    review = db.query(Review).filter(Review.booking_id == booking_id).first()
    if not review:
        review = Review(
            booking_id=booking_id,
            citizen_id=citizen_id,
            technician_id=technician_id,
            rating=req.rating,
            comment=req.comment,
            photo_url=req.photo
        )
        db.add(review)
    else:
        review.rating = req.rating
        review.comment = req.comment
        review.photo_url = req.photo

    # Update technician rating & jobs count
    tech_prof = db.query(TechnicianProfile).filter(TechnicianProfile.user_id == technician_id).first()
    if tech_prof:
        tech_prof.jobs_count += 1
        # Recalculate rolling rating
        tech_prof.rating = round((tech_prof.rating * 0.9) + (req.rating * 0.1), 1)

    db.commit()
    db.refresh(review)

    return ReviewResponse(
        id=review.id,
        booking_id=review.booking_id,
        citizen_name=booking.citizen_name,
        technician_id=technician_id,
        rating=review.rating,
        comment=review.comment,
        date="Today"
    )
