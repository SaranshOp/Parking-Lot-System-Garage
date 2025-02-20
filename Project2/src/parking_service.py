# parking_service.py (updated)
from typing import Dict, List, Optional
from parking_lot import ParkingLot, User, UserRole

class ParkingService:
    def __init__(self):
        self.parking_lots: Dict[str, ParkingLot] = {}
        self.admins: Dict[str, List[str]] = {}  # {admin_user: [parking_lot_names]}

    def create_parking_lot(self, name: str, floors: int, spots: int) -> ParkingLot:
        # if user.role != UserRole.ADMIN:
        #     raise PermissionError("Only admins can create parking lots")
            
        if name in self.parking_lots:
            raise ValueError("Parking lot already exists")
            
        lot = ParkingLot(name, floors, spots)
        self.parking_lots[name] = lot
        
        user = User(username="system_admin", role=UserRole.ADMIN)
        # Track admin ownership
        if user.username not in self.admins:
            self.admins[user.username] = []
        self.admins[user.username].append(name)
        
        return lot

    def get_parking_lot(self, name: str) -> Optional[ParkingLot]:
        return self.parking_lots.get(name)

    def list_parking_lots(self) -> List[str]:
        return list(self.parking_lots.keys())

    # def validate_admin_access(self, user: User, lot_name: str) -> bool:
    #     return user.role == UserRole.ADMIN and lot_name in self.admins.get(user.username, [])
    def validate_admin_access(self, lot_name: str) -> bool:    # Temporary implementation
        return lot_name in self.parking_lots
