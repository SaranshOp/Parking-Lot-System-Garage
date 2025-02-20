import pytest
from fastapi.testclient import TestClient
from ..src.api import app

client = TestClient(app)

def test_park_vehicle():
    response = client.post(
        "/park",
        json={"registration_number": "TEST123", "vehicle_type": "CAR"}
    )
    assert response.status_code == 200
    assert "location" in response.json()

def test_invalid_vehicle():
    response = client.post(
        "/park",
        json={"registration_number": "TEST123", "vehicle_type": "INVALID"}
    )
    assert response.status_code == 400

def test_get_status():
    response = client.get("/status")
    assert response.status_code == 200
    assert "available_spots" in response.json()
    assert "is_full" in response.json()
