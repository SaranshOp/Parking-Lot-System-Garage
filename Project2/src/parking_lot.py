# parking_lot.py (updated with full features)
from enum import Enum
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from asyncio import Lock
from pydantic import BaseModel

class UserRole(Enum):
    ADMIN = "ADMIN"
    OPERATOR = "OPERATOR"
    USER = "USER"

class User(BaseModel):
    username: str
    role: UserRole
#    managed_lots: List[str] = []

class VehicleType(Enum):
    BIKE = 1
    CAR = 2
    TRUCK = 3
    
    @property
    def spots_needed(self) -> int:
        if self in (VehicleType.BIKE, VehicleType.CAR):
            return 1
        return 2 


class PaymentStatus(Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"

class ParkingActivity(BaseModel):
    registration: str
    entry_time: datetime
    exit_time: Optional[datetime] = None
    amount_paid: float = 0.0

class Vehicle:
    def __init__(self, reg_num: str, vehicle_type: VehicleType):
        self.reg_num = reg_num
        self.vehicle_type = vehicle_type
        self.entry_time = datetime.now()
        self.exit_time: Optional[datetime] = None
        self.payment_status = PaymentStatus.PENDING
        self.assigned_spots: List[Tuple[int, int]] = []

class ParkingSpot:
    def __init__(self, floor_id: int, spot_id: int):
        self.floor_id = floor_id
        self.spot_id = spot_id
        self.is_occupied = False
        self.vehicle: Optional[Vehicle] = None
        self.vehicle_type: Optional[VehicleType] = None

class ParkingFloor:
    def __init__(self, floor_id: int, spots_per_floor: int):
        self.floor_id = floor_id
        self.spots = [ParkingSpot(floor_id, i) for i in range(spots_per_floor)]
        self.lock = Lock()

    async def find_available_spots(self, vehicle_type: VehicleType) -> List[ParkingSpot]:
        required = vehicle_type.spots_needed
        consecutive = 0
        available = []
        
        for spot in self.spots:
            if not spot.is_occupied and (spot.vehicle_type in (None, vehicle_type)):
                consecutive += 1
                available.append(spot)
                if consecutive == required:
                    return available
            else:
                consecutive = 0
                available.clear()
        return []

class ParkingLot:
    def __init__(self, name: str, num_floors: int, spots_per_floor: int):
        self.name = name
        self.floors = [ParkingFloor(i, spots_per_floor) for i in range(num_floors)]
        self.vehicles: Dict[str, Vehicle] = {}
        self.lock = Lock()
        self.activity_log: List[ParkingActivity] = []
        self.hourly_rate = 10  # Default rate

    async def park_vehicle(self, reg_num: str, vehicle_type: VehicleType) -> Optional[Tuple[int, int]]:
        
            if reg_num in self.vehicles:
                return None

            vehicle = Vehicle(reg_num, vehicle_type)
            spots = []
            
            for floor in self.floors:
                print (f"iterating through : {floor}")
                async with floor.lock:
                    print(f"floor lock acquired")
                    available = await floor.find_available_spots(vehicle_type)
                    print (f"available spots : {available}")
                    if len(available) >= vehicle_type.spots_needed:
                        for spot in available:
                            spot.is_occupied = True
                            spot.vehicle = vehicle
                            spot.vehicle_type = vehicle_type
                            vehicle.assigned_spots.append((floor.floor_id, spot.spot_id))
                            spots.append((floor.floor_id, spot.spot_id))
                        break

            if spots:
                print(f"parked at {spots}")
                async with self.lock:
                    self.vehicles[reg_num] = vehicle
                    self.activity_log.append(ParkingActivity(
                        registration=reg_num,
                        entry_time=vehicle.entry_time
                    ))
                return spots[0]
            return None

    async def remove_vehicle(self, reg_num: str) -> bool:
        async with self.lock:
            if reg_num not in self.vehicles:
                return False

            vehicle = self.vehicles[reg_num]
            if vehicle.payment_status != PaymentStatus.COMPLETED:
                return False

            for floor_id, spot_id in vehicle.assigned_spots:
                floor = self.floors[floor_id]
                async with floor.lock:
                    spot = floor.spots[spot_id]
                    spot.is_occupied = False
                    spot.vehicle = None

            vehicle.exit_time = datetime.now()
            del self.vehicles[reg_num]

            # Update activity log
            for activity in self.activity_log:
                if activity.registration == reg_num:
                    activity.exit_time = vehicle.exit_time
                    break

            return True

    async def process_payment(self, reg_num: str) -> bool:
        async with self.lock:
            if reg_num not in self.vehicles:
                return False
            
            vehicle = self.vehicles[reg_num]
            if vehicle.payment_status == PaymentStatus.COMPLETED:
                return True

            # Calculate payment
            duration = (datetime.now() - vehicle.entry_time).total_seconds() / 3600
            amount = round(duration * self.hourly_rate, 2)
            
            # Simulate payment processing
            vehicle.payment_status = PaymentStatus.COMPLETED
            
            # Update activity log
            for activity in self.activity_log:
                if activity.registration == reg_num:
                    activity.amount_paid = amount
                    break

            return True

    async def get_availability(self, vehicle_type: VehicleType) -> Dict[int, int]:
        availability = {}
        for floor in self.floors:
            async with floor.lock:
                count = 0
                required = vehicle_type.spots_needed
                consecutive = 0
                for spot in floor.spots:
                    if not spot.is_occupied and (spot.vehicle_type in (None, vehicle_type)):
                        consecutive += 1
                        if consecutive == required:
                            count += 1
                            consecutive = 0
                    else:
                        consecutive = 0
                availability[floor.floor_id] = count
        return availability

    async def get_parking_history(self) -> List[ParkingActivity]:
        return self.activity_log.copy()

    async def get_vehicle_info(self, reg_num: str) -> Optional[Dict]:
        if reg_num not in self.vehicles:
            return None
            
        vehicle = self.vehicles[reg_num]
        return {
            "registration": vehicle.reg_num,
            "type": vehicle.vehicle_type.name,
            "entry_time": vehicle.entry_time,
            "payment_status": vehicle.payment_status.value,
            "assigned_spots": vehicle.assigned_spots
        }
