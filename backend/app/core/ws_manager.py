from typing import Dict, List
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger("ws_manager")

class ConnectionManager:
    def __init__(self):
        # booking_id -> list of active WebSockets
        self.active_rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, booking_id: str, websocket: WebSocket):
        await websocket.accept()
        if booking_id not in self.active_rooms:
            self.active_rooms[booking_id] = []
        self.active_rooms[booking_id].append(websocket)
        logger.info(f"WebSocket connected to room {booking_id}. Total: {len(self.active_rooms[booking_id])}")

    def disconnect(self, booking_id: str, websocket: WebSocket):
        if booking_id in self.active_rooms:
            if websocket in self.active_rooms[booking_id]:
                self.active_rooms[booking_id].remove(websocket)
            if not self.active_rooms[booking_id]:
                del self.active_rooms[booking_id]
        logger.info(f"WebSocket disconnected from room {booking_id}")

    async def broadcast_to_room(self, booking_id: str, message: dict):
        if booking_id in self.active_rooms:
            for connection in list(self.active_rooms[booking_id]):
                try:
                    await connection.send_text(json.dumps(message))
                except Exception as e:
                    logger.error(f"Error broadcasting message: {e}")
                    self.disconnect(booking_id, connection)

manager = ConnectionManager()
