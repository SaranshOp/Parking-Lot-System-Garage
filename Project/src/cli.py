# cli.py
from parking_lot import ParkingLot

def main():
    print("Welcome to Parking Lot System")
    num_floors = int(input("Enter number of floors: "))
    spots_per_floor = int(input("Enter spots per floor: "))
    
    parking_lot = ParkingLot(num_floors, spots_per_floor)

    while True:
        print("\nParking Lot Management System")
        print("1. Park Vehicle")
        print("2. Remove Vehicle")
        print("3. Process Payment")
        print("4. Show Vehicle Location")
        print("5. Show Available Spots")
        print("6. Show All Vehicles")
        print("7. Exit")

        choice = input("\nEnter your choice (1-7): ")

        try:
            if choice == "1":
                reg_num = input("Enter vehicle registration number: ")
                v_type = input("Enter vehicle type (CAR/BIKE/TRUCK): ")
                location = parking_lot.park_vehicle(reg_num, v_type)
                if location:
                    print(f"Vehicle parked at Floor {location[0]}, Spot {location[1]}")
                else:
                    print("No parking space available")

            elif choice == "2":
                reg_num = input("Enter vehicle registration number: ")
                if parking_lot.remove_vehicle(reg_num):
                    print("Vehicle removed successfully")
                else:
                    print("Vehicle removal failed: Not found or payment pending")

            elif choice == "3":
                reg_num = input("Enter vehicle registration number: ")
                if parking_lot.process_payment(reg_num):
                    print("Payment processed successfully")
                else:
                    print("Payment failed: Vehicle not found")

            elif choice == "4":
                reg_num = input("Enter vehicle registration number: ")
                location = parking_lot.get_vehicle_location(reg_num)
                if location:
                    print("Vehicle locations:", location)
                else:
                    print("Vehicle not found")

            elif choice == "5":
                spots = parking_lot.get_available_spots()
                print("\nAvailable spots per floor:")
                for floor, count in spots.items():
                    print(f"Floor {floor}: {count} spots")

            elif choice == "6":
                vehicles = parking_lot.all_vehicles()
                if vehicles:
                    print("\nAll parked vehicles:")
                    for reg_num, floor, spot in vehicles:
                        print(f"Vehicle {reg_num} at Floor {floor}, Spot {spot}")
                else:
                    print("No vehicles parked")

            elif choice == "7":
                print("Thank you for using Parking Lot System")
                break

        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
