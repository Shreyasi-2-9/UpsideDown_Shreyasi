import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_lock_price_creates_escrow():
    response = client.post(
        "/api/v1/bookings/HC-2841/lock-price",
        json={"quoteId": "q-1", "paymentMethod": "UPI"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["escrow_status"] == "held"
    assert data["booking_id"] == "HC-2841"
    assert "technician_eta" in data

def test_cannot_counter_offer_after_lock():
    # Price is now locked
    response = client.post(
        "/api/v1/bookings/HC-2841/counter-offer",
        json={"amount": 320.0}
    )
    assert response.status_code == 400
    assert "Price is already locked" in response.json()["detail"]
