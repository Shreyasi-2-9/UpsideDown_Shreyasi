from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from app.db.session import get_db, SessionLocal
from app.models.booking import Booking
from app.models.chat import ChatMessage
from app.models.user import User
from app.schemas.chat import ChatMessageCreate, ChatMessageOut
from app.core.ws_manager import manager
from app.routers.deps import get_current_user_optional

router = APIRouter(tags=["Chat"])

@router.get("/bookings/{booking_id}/messages", response_model=List[ChatMessageOut])
def get_booking_messages(booking_id: str, db: Session = Depends(get_db)):
    msgs = db.query(ChatMessage).filter(ChatMessage.booking_id == booking_id).order_by(ChatMessage.created_at.asc()).all()
    return [
        ChatMessageOut(
            id=m.id,
            booking_id=m.booking_id,
            sender=m.sender_role,
            senderName=m.sender_name,
            text=m.text,
            timestamp=m.created_at.strftime("%I:%M %p") if m.created_at else "Just now",
            status=m.status,
            photoUrl=m.photo_url
        )
        for m in msgs
    ]

@router.post("/bookings/{booking_id}/messages", response_model=ChatMessageOut)
async def send_chat_message(
    booking_id: str,
    req: ChatMessageCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    sender_name = req.senderName
    if not sender_name and current_user:
        sender_name = current_user.name
    elif not sender_name:
        sender_name = "Citizen" if req.sender == "citizen" else "Technician"

    msg = ChatMessage(
        booking_id=booking_id,
        sender_id=current_user.id if current_user else None,
        sender_role=req.sender,
        sender_name=sender_name,
        text=req.text,
        photo_url=req.photoUrl,
        status="delivered"
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    out = ChatMessageOut(
        id=msg.id,
        booking_id=msg.booking_id,
        sender=msg.sender_role,
        senderName=msg.sender_name,
        text=msg.text,
        timestamp=msg.created_at.strftime("%I:%M %p") if msg.created_at else "Just now",
        status=msg.status,
        photoUrl=msg.photo_url
    )

    # Broadcast via WebSocket to room if active
    await manager.broadcast_to_room(booking_id, out.model_dump())

    return out

@router.websocket("/ws/bookings/{booking_id}")
async def websocket_chat_endpoint(websocket: WebSocket, booking_id: str):
    await manager.connect(booking_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Expecting {"sender": "citizen", "text": "...", "senderName": "..."}
            text = data.get("text")
            sender = data.get("sender", "citizen")
            sender_name = data.get("senderName", "User")
            photo_url = data.get("photoUrl")

            if text:
                db = SessionLocal()
                try:
                    msg = ChatMessage(
                        booking_id=booking_id,
                        sender_role=sender,
                        sender_name=sender_name,
                        text=text,
                        photo_url=photo_url,
                        status="delivered"
                    )
                    db.add(msg)
                    db.commit()
                    db.refresh(msg)

                    out = {
                        "id": msg.id,
                        "booking_id": msg.booking_id,
                        "sender": msg.sender_role,
                        "senderName": msg.sender_name,
                        "text": msg.text,
                        "timestamp": msg.created_at.strftime("%I:%M %p"),
                        "status": "delivered",
                        "photoUrl": msg.photo_url
                    }
                    await manager.broadcast_to_room(booking_id, out)
                finally:
                    db.close()
    except WebSocketDisconnect:
        manager.disconnect(booking_id, websocket)
    except Exception:
        manager.disconnect(booking_id, websocket)
