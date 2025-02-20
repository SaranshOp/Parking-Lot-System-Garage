from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from parking_lot import ParkingLot, User, UserRole
from typing import Optional 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from services.parking_service import ParkingService 
from pydantic import BaseModel  


app = FastAPI()
parking_service = ParkingService()


app.mount("/static", StaticFiles(directory="static"), name="static")


templates = Jinja2Templates(directory="templates")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VehicleInput(BaseModel):
    registration_number: str
    vehicle_type: str

class ParkingResponse(BaseModel):
    location: Optional[tuple]
    message: str

class CreateParkingLotInput(BaseModel):
    name: str
    num_floors: int
    spots_per_floor: int

parking_lot = ParkingLot(2, 5)

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Admin endpoint to create a new parking lot
@app.post("/admin/create-parking-lot")
async def create_parking_lot(input_data: CreateParkingLotInput):
    admin_user = User(username="admin", role=UserRole.ADMIN)  # Simulate an admin user for now
    try:
        message = parking_service.create_parking_lot(
            admin_user,
            input_data.name,
            input_data.num_floors,
            input_data.spots_per_floor
        )
        return {"message": message}
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

# Operator endpoint to park a vehicle in a specific parking lot
@app.post("/operator/park")
async def operator_park(vehicle: VehicleInput):
    operator_user = User(username="operator", role=UserRole.OPERATOR)  # Simulate an operator user for now
    try:
        parking_lot = parking_service.get_parking_lot("default")  # Use default parking lot for now
        location = parking_lot.park_vehicle(vehicle.registration_number, vehicle.vehicle_type)
        if location:
            return {"message": f"Vehicle parked at Floor {location[0]}, Spot {location[1]}"}
        else:
            raise HTTPException(status_code=400, detail="No available spots.")
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@app.post("/park", response_model=ParkingResponse)
async def park_vehicle(vehicle: VehicleInput, role: str = "USER"):
    if role not in ["ADMIN", "OPERATOR", "USER"]:
        raise HTTPException(status_code=403, detail="Invalid role")

    try:
        location = parking_lot.park_vehicle(vehicle.registration_number, vehicle.vehicle_type)
        if location:
            return ParkingResponse(
                location=location,
                message=f"Vehicle parked at Floor {location[0]}, Spot {location[1]}"
            )
        return ParkingResponse(location=None, message="No parking space available")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/exit/{registration_number}")
async def remove_vehicle(registration_number: str):
    if parking_lot.remove_vehicle(registration_number):
        return {"message": "Vehicle removed successfully"}
    raise HTTPException(status_code=404, detail="Vehicle not found or payment pending")

@app.get("/status")
async def get_status():
    return {
        "available_spots": parking_lot.get_available_spots(),
        "is_full": parking_lot.is_full(),
        "all_vehicles": parking_lot.all_vehicles()
    }

@app.post("/payment/{registration_number}")
async def process_payment(registration_number: str):
    if parking_lot.process_payment(registration_number):
        return {"message": "Payment processed successfully"}
    raise HTTPException(status_code=404, detail="Vehicle not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
