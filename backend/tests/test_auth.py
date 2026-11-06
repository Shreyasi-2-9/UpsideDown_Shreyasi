import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_login_citizen():
    response = client.post(
        "/api/v1/auth/login",
        json={"phone_or_email": "+91 98221 12345", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["name"] == "Asha Sharma"
    assert data["user"]["role"] == "citizen"

def test_auth_login_admin():
    response = client.post(
        "/api/v1/auth/login",
        json={"phone_or_email": "admin@homecare360.gov.in", "password": "3600"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "admin"

def test_auth_invalid_credentials():
    response = client.post(
        "/api/v1/auth/login",
        json={"phone_or_email": "+91 98221 12345", "password": "wrongpassword"}
    )
    assert response.status_code == 401
