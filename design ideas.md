# Design Ideas

okay alright <br>
lets do this <br>

Question and Problem Statement
Problem Statement  
Design and implement a parking lot system that supports the following requirements:

Functional Requirements:

The parking lot should have multiple floors, each with a fixed number of parking spots.  
Vehicles can be of different types: Car, Bike, Truck.

Different vehicle types require different space allocations:  
 Bike → 1 spot  
 Car → 1 spot  
 Truck → 2 consecutive spots

    A vehicle can enter the parking lot and be assigned the nearest available spot.
    A vehicle can leave, freeing up its spot(s).
    The system should allow querying:
    Number of available spots per floor.
    Whether the parking lot is full.
    The current location of a vehicle (if parked).

Non-Functional Requirements:

    The solution should be object-oriented and follow clean coding principles.
    The system should handle concurrent parking operations safely.
    Optimize for quick vehicle lookup.
    The approach should be extended to future requirements. Command terminal based input/output will be fine.

Example :
parking_lot = ParkingLot(num_floors=3, spots_per_floor=10)
parking_lot.park_vehicle("KA-01-1234", "Car")

# My Notes.



