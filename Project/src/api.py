# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from parking_lot import ParkingLot
from typing import Dict, List, Optional

app = FastAPI()

parking_lot = ParkingLot(num_floors=3, spots_per_floor=10)

class VehicleInput(BaseModel):
    registration_number: str
    vehicle_type: str

@app.post("/park")
async def park_vehicle(vehicle: VehicleInput):
    try:
        success = parking_lot.park_vehicle(
            vehicle.registration_number, 
            vehicle.vehicle_type
        )
        if success:
            return {"message": "Vehicle parked successfully"}
        raise HTTPException(status_code=400, detail="No parking space available")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/vehicles/{registration_number}")
async def remove_vehicle(registration_number: str):
    if parking_lot.remove_vehicle(registration_number):
        return {"message": "Vehicle removed successfully"}
    raise HTTPException(status_code=404, detail="Vehicle not found")

@app.get("/status")
async def get_status():
    return {
        "available_spots": parking_lot.get_available_spots(),
        "is_full": parking_lot.is_full()
    }

@app.get("/vehicles/{registration_number}")
async def get_vehicle_location(registration_number: str):
    location = parking_lot.get_vehicle_location(registration_number)
    if location:
        return {"location": location}
    raise HTTPException(status_code=404, detail="Vehicle not found")
