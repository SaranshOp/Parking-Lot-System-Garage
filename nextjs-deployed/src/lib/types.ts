export enum UserRole {
    ADMIN = "ADMIN",
    OPERATOR = "OPERATOR",
    USER = "USER"
  }
  
  export enum VehicleType {
    BIKE = 1,
    CAR = 2,
    TRUCK = 3
  }
  
  export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED"
  }
  
  export interface User {
    username: string;
    role: UserRole;
  }
  
  export interface ParkingActivity {
    registration: string;
    entry_time: Date;
    exit_time?: Date;
    amount_paid: number;
  }
  
  export interface Vehicle {
    reg_num: string;
    vehicle_type: VehicleType;
    entry_time: Date;
    exit_time?: Date;
    payment_status: PaymentStatus;
    assigned_spots: [number, number][];
  }
  
  export interface ParkingSpot {
    floor_id: number;
    spot_id: number;
    is_occupied: boolean;
    vehicle?: Vehicle;
    vehicle_type?: VehicleType;
  }

  export function getSpotsNeeded(type: VehicleType): number {
    return type <= VehicleType.CAR && type >= VehicleType.BIKE ? 1 : 2;
  }