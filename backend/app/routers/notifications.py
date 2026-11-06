from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.routers.deps import get_current_user_optional

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(Notification)
    if current_user:
        query = query.filter(
            (Notification.user_id == current_user.id) |
            (Notification.role_target == "all") |
            (Notification.role_target == current_user.role)
        )
    
    notifs = query.order_by(Notification.created_at.desc()).limit(30).all()
    return [
        NotificationResponse(
            id=n.id,
            title=n.title,
            body=n.body,
            timestamp=n.created_at.strftime("%I:%M %p") if n.created_at else "Just now",
            read=n.read,
            roleTarget=n.role_target,
            type=n.type
        )
        for n in notifs
    ]

@router.patch("/{notif_id}/read", response_model=dict)
def mark_notification_read(notif_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if notif:
        notif.read = True
        db.commit()
    return {"status": "success"}

@router.post("/read-all", response_model=dict)
def mark_all_read(db: Session = Depends(get_db)):
    db.query(Notification).update({Notification.read: True})
    db.commit()
    return {"status": "success"}
