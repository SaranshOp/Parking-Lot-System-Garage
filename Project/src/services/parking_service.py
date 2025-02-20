from parking_lot import ParkingLot, User, UserRole
from typing import List

class ParkingService:
    def __init__(self):
        self.parking_lots = {}  # Store multiple parking lots by name

    def create_parking_lot(self, user: User, name: str, num_floors: int, spots_per_floor: int):
        """Admin creates a new parking lot."""
        if user.role != UserRole.ADMIN:
            raise PermissionError("Only admins can create parking lots.")
        if name in self.parking_lots:
            raise ValueError(f"Parking lot '{name}' already exists.")
        
        self.parking_lots[name] = ParkingLot(num_floors=num_floors, spots_per_floor=spots_per_floor)
        return f"Parking lot '{name}' created successfully."

    def get_parking_lot(self, name: str) -> ParkingLot:
        """Retrieve a specific parking lot by name."""
        if name not in self.parking_lots:
            raise ValueError(f"Parking lot '{name}' not found.")
        return self.parking_lots[name]

    def list_parking_lots(self) -> List[str]:
        """List all available parking lots."""
        return list(self.parking_lots.keys())
