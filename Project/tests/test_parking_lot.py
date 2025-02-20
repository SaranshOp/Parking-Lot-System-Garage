# test_parking_lot.py
import unittest
from ..src.parking_lot import ParkingLot
from datetime import datetime, timedelta

class TestParkingLot(unittest.TestCase):
    def setUp(self):
        self.parking_lot = ParkingLot(num_floors=2, spots_per_floor=5)

    def test_park_vehicle(self):
        location = self.parking_lot.park_vehicle("KA-01-1234", "CAR")
        self.assertIsNotNone(location)
        self.assertEqual(location[0], 0)
        self.assertEqual(location[1], 0)

    def test_park_truck(self):
        location = self.parking_lot.park_vehicle("KA-01-5678", "TRUCK")
        self.assertIsNotNone(location)
        self.assertEqual(len(self.parking_lot.vehicle_map["KA-01-5678"].spots), 2)

    def test_remove_vehicle_with_payment(self):
        self.parking_lot.park_vehicle("KA-01-1234", "CAR")
        self.assertFalse(self.parking_lot.remove_vehicle("KA-01-1234"))
        self.assertTrue(self.parking_lot.process_payment("KA-01-1234"))
        self.assertTrue(self.parking_lot.remove_vehicle("KA-01-1234"))

    def test_get_vehicle_location(self):
        self.parking_lot.park_vehicle("KA-01-1234", "CAR")
        location = self.parking_lot.get_vehicle_location("KA-01-1234")
        self.assertIsNotNone(location)
        self.assertEqual(location[0], (0, 0))

if __name__ == '__main__':
    unittest.main()
