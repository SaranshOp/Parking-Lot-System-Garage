# api.py (updated with full functionality)
from fastapi import FastAPI, HTTPException, Request, Depends, Cookie, Form
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from parking_lot import ParkingLot, VehicleType, PaymentStatus, UserRole, ParkingActivity, User 
from parking_service import ParkingService
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

app = FastAPI()
from pathlib import Path
templates = Jinja2Templates(directory=str(Path(__file__).parent / "templates"))
parking_service = ParkingService()

# ------ Dependency Injection ------
async def get_current_role(request: Request) -> UserRole:
    role = request.cookies.get("session_role")
    if role not in UserRole.__members__:
        return UserRole.USER
    return UserRole[role]

# ------ Security Improvements ------
class RoleChecker:
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, role: UserRole = Depends(get_current_role)):
        print(f"RoleChecker invoked with role: {role}")
        if role not in self.allowed_roles:
            print(f"Access denied for role: {role}")
            raise HTTPException(403, "Insufficient permissions")



async def get_parking_lot(lot_name: str) -> ParkingLot:
    lot = parking_service.get_parking_lot(lot_name)
    if not lot:
        raise HTTPException(404, "Parking lot not found")
    
    print("lot name {lot_name} Picked up")
    return lot

# ------ Routes ------
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/select-role")
async def select_role(role: UserRole = Form(...)):
    response = RedirectResponse(url="/dashboard", status_code=303)
    response.set_cookie(key="session_role", value=role.value, httponly=True)
    print ( "cookie set to change role response {response.cookies}")

    return response

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, role: UserRole = Depends(get_current_role)):
    print(f"Vehicle types: {[vt for vt in VehicleType]}")
    context = {
        "request": request,
        "role": role.value,
        "lots": parking_service.list_parking_lots(),
        "vehicle_types": [vt.name for vt in VehicleType]
    }
    print(f"Dashboard context: {context}")
    
    return templates.TemplateResponse("dashboard.html", context)

# ------ Admin Endpoints ------
@app.post("/admin/create-lot")
async def create_lot(
    name: str = Form(...),
    floors: int = Form(...),
    spots: int = Form(...),
    role: UserRole = Depends(get_current_role),
    _=Depends(RoleChecker([UserRole.ADMIN]))
):
    try:
        parking_service.create_parking_lot(name, floors, spots)
        print(f"Created parking lot {name}")
        return {
            "success": True,
            "message": f"Parking lot '{name}' created successfully with {floors} floors and {spots} spots per floor"
        }
    except ValueError as e:
        raise HTTPException(400, str(e))

# ------ Operator Endpoints ------
@app.post("/operator/park")
async def park_vehicle(
    lot_name: str = Form(...),
    reg_num: str = Form(...),
    vehicle_type: str = Form(...),
    role: UserRole = Depends(get_current_role),
    _=Depends(RoleChecker([UserRole.ADMIN, UserRole.OPERATOR]))
):
    print(f"lot name {lot_name} started up")
    lot = await get_parking_lot(lot_name)
    print(f"lot name {lot_name} Picked up")
    try:
        vt = VehicleType[vehicle_type.upper()]
        print( f"Vehicle type {vt} picked up")
        spot = await lot.park_vehicle(reg_num, vt)
        return {"message": f"Parked at Floor {spot[0]} Spot {spot[1]}" if spot else "No spots available"}
    except KeyError:
        raise HTTPException(400, "Invalid vehicle type")

@app.post("/operator/exit")
async def exit_vehicle(
    lot_name: str = Form(...),
    reg_num: str = Form(...),
    role: UserRole = Depends(get_current_role),
    _=Depends(RoleChecker([UserRole.ADMIN, UserRole.OPERATOR]))
):
    lot = await get_parking_lot(lot_name)
    success = await lot.remove_vehicle(reg_num)
    return {"success": success, "message": "Vehicle exited" if success else "Exit failed"}

@app.post("/operator/payment")
async def process_payment(
    lot_name: str = Form(...),
    reg_num: str = Form(...),
    role: UserRole = Depends(get_current_role),
    _=Depends(RoleChecker([UserRole.ADMIN, UserRole.OPERATOR]))
):
    lot = await get_parking_lot(lot_name)
    success = await lot.process_payment(reg_num)
    return {"success": success, "message": "Payment processed" if success else "Payment failed"}

# ------ User Endpoints ------
@app.get("/availability/{lot_name}/{vehicle_type}", response_class=JSONResponse)
async def check_availability(lot_name: str, vehicle_type: str):
    lot = await get_parking_lot(lot_name)
    try:
        vt = VehicleType[vehicle_type.upper()]
        availability = await lot.get_availability(vt)
        return {
            "lot": lot_name,
            "vehicle_type": vehicle_type,
            "availability": availability
        } 
    except KeyError:
        raise HTTPException(400, "Invalid vehicle type")

@app.get("/history/{lot_name}", response_class=JSONResponse)
async def get_history(lot_name: str):
    lot = await get_parking_lot(lot_name)
    history = await lot.get_parking_history()
    return {"history": [activity.dict() for activity in history]}

# ------ Vehicle Info Endpoint ------
@app.get("/vehicle/{lot_name}/{reg_num}", response_class=JSONResponse)
async def get_vehicle_info(lot_name: str, reg_num: str):
    lot = await get_parking_lot(lot_name)
    info = await lot.get_vehicle_info(reg_num)
    if not info:
        raise HTTPException(404, "Vehicle not found")
    return info

@app.get("/vehicle-lookup/{reg_num}", response_class=JSONResponse)
async def lookup_vehicle(reg_num: str):
    # Search across all parking lots
    for lot_name, lot in parking_service.parking_lots.items():
        info = await lot.get_vehicle_info(reg_num)
        if info:
            return {
                "found": True,
                "lot_name": lot_name,
                "registration": info["registration"],
                "floor_id": info["assigned_spots"][0][0],
                "spot_id": info["assigned_spots"][0][1],
                "entry_time": info["entry_time"].strftime("%Y-%m-%d %H:%M:%S"),
                "payment_status": info["payment_status"]
            }
    return {"found": False, "message": "Vehicle not found in any parking lot"}

