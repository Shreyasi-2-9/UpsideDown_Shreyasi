import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_negotiable_booking():
    res = client.post(
        "/api/v1/bookings",
        json={
            "serviceId": "plumbing",
            "issueDescription": "Test pipe leak",
            "lockedPrice": 340.0
        }
    )
    assert res.status_code == 200
    return res.json()["id"]

def test_counter_offer_within_range():
    booking_id = create_negotiable_booking()
    # Plumbing local_min is 300, local_max is 420
    response = client.post(
        f"/api/v1/bookings/{booking_id}/counter-offer",
        json={"amount": 330.0}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 330.0
    assert data["status"] == "counter_offered"

def test_counter_offer_below_min_rejected():
    booking_id = create_negotiable_booking()
    # Below 300
    response = client.post(
        f"/api/v1/bookings/{booking_id}/counter-offer",
        json={"amount": 250.0}
    )
    assert response.status_code == 400
    assert "₹300" in response.json()["detail"]

def test_counter_offer_above_max_rejected():
    booking_id = create_negotiable_booking()
    # Above 420
    response = client.post(
        f"/api/v1/bookings/{booking_id}/counter-offer",
        json={"amount": 500.0}
    )
    assert response.status_code == 400
    assert "₹420" in response.json()["detail"]
