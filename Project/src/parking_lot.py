from enum import Enum
from typing import Dict, List, Optional
import threading
from datetime import datetime

class VehicleType(Enum):
    BIKE = 1
    CAR = 1
    TRUCK = 2

class PaymentStatus(Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"

class Vehicle:
    def __init__(self, registration_number: str, vehicle_type: VehicleType):
        self.registration_number = registration_number
        self.vehicle_type = vehicle_type
        self.spots: List[ParkingSpot] = []
        self.payment_status = PaymentStatus.PENDING
        self.entry_time = datetime.now()

class ParkingSpot:
    def __init__(self, floor_id: int, spot_id: int):
        self.floor_id = floor_id
        self.spot_id = spot_id
        self.is_occupied = False
        self.vehicle: Optional[Vehicle] = None

class ParkingFloor:
    def __init__(self, floor_id: int, num_spots: int):
        self.floor_id = floor_id
        self.spots = [ParkingSpot(floor_id, i) for i in range(num_spots)]
        self.lock = threading.Lock()

    def find_available_spots(self, required_spots: int) -> List[ParkingSpot]:
        consecutive_spots = []
        for spot in self.spots:
            if not spot.is_occupied:
                consecutive_spots.append(spot)
                if len(consecutive_spots) == required_spots:
                    return consecutive_spots
            else:
                consecutive_spots = []
        return []

class ParkingLot:
    def __init__(self, num_floors: int, spots_per_floor: int):
        self.floors = [ParkingFloor(i, spots_per_floor) for i in range(num_floors)]
        self.vehicle_map: Dict[str, Vehicle] = {}
        self.lock = threading.Lock()

    def park_vehicle(self, registration_number: str, vehicle_type: str) -> Optional[tuple]:
        with self.lock:
            if registration_number in self.vehicle_map:
                raise ValueError("Vehicle already parked")

            v_type = VehicleType[vehicle_type.upper()]
            vehicle = Vehicle(registration_number, v_type)
            required_spots = v_type.value

            for floor in self.floors:
                with floor.lock:
                    spots = floor.find_available_spots(required_spots)
                    if spots:
                        for spot in spots:
                            spot.is_occupied = True
                            spot.vehicle = vehicle
                            vehicle.spots.append(spot)
                        self.vehicle_map[registration_number] = vehicle
                        return (floor.floor_id, spots[0].spot_id)
            return None

    def remove_vehicle(self, registration_number: str) -> bool:
        with self.lock:
            if registration_number not in self.vehicle_map:
                return False

            vehicle = self.vehicle_map[registration_number]
            if vehicle.payment_status != PaymentStatus.COMPLETED:
                return False

            for spot in vehicle.spots:
                with self.floors[spot.floor_id].lock:
                    spot.is_occupied = False
                    spot.vehicle = None
            
            del self.vehicle_map[registration_number]
            return True

    def process_payment(self, registration_number: str) -> bool:
        if registration_number in self.vehicle_map:
            # Assuming payment is successful here
            self.vehicle_map[registration_number].payment_status = PaymentStatus.COMPLETED
            return True
        return False

    def get_vehicle_location(self, registration_number: str) -> Optional[List[tuple]]:
        if registration_number not in self.vehicle_map:
            return None
        vehicle = self.vehicle_map[registration_number]
        return [(spot.floor_id, spot.spot_id) for spot in vehicle.spots]

    def get_available_spots(self) -> Dict[int, int]:
        available_spots = {}
        for floor in self.floors:
            count = sum(1 for spot in floor.spots if not spot.is_occupied)
            available_spots[floor.floor_id] = count
        return available_spots

    def all_vehicles(self) -> List[tuple]:
        return [(v.registration_number, v.spots[0].floor_id, v.spots[0].spot_id) 
                for v in self.vehicle_map.values()]

# if __name__ == "__main__":
#     parking_lot = ParkingLot(2, 5)
#     print(parking_lot.park_vehicle("KA-01-1234", "CAR"))
#     print(parking_lot.park_vehicle("KA-01-1235", "BIKE"))
#     print(parking_lot.park_vehicle("KA-01-1236", "TRUCK"))
#     print(parking_lot.all_vehicles())
#     print(parking_lot.get_vehicle_location("KA-01-1234"))
#     print(parking_lot.get_available_spots())
#     print(parking_lot.remove_vehicle("KA-01-1234"))
#     print(parking_lot.get_available_spots())
#     print(parking_lot.process_payment("KA-01-1234"))
#     print(parking_lot.remove_vehicle("KA-01-1234"))
#     print(parking_lot.get_available_spots())
