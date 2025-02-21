import { VehicleType, PaymentStatus, ParkingActivity, Vehicle, ParkingSpot } from './types';

class ParkingFloor {
  floor_id: number;
  spots: ParkingSpot[];

  constructor(floor_id: number, spots_per_floor: number) {
    this.floor_id = floor_id;
    this.spots = Array.from({ length: spots_per_floor }, (_, i) => ({
      floor_id,
      spot_id: i,
      is_occupied: false
    }));
  }

  async findAvailableSpots(vehicle_type: VehicleType): Promise<ParkingSpot[]> {
    const required = vehicle_type <= VehicleType.CAR ? 1 : 2;
    let consecutive = 0;
    let available: ParkingSpot[] = [];

    for (const spot of this.spots) {
      if (!spot.is_occupied && (!spot.vehicle_type || spot.vehicle_type === vehicle_type)) {
        consecutive++;
        available.push(spot);
        if (consecutive === required) return available;
      } else {
        consecutive = 0;
        available = [];
      }
    }
    return [];
  }
}

export class ParkingLot {
  name: string;
  floors: ParkingFloor[];
  vehicles: Map<string, Vehicle>;
  activity_log: ParkingActivity[];
  hourly_rate: number;

  constructor(name: string, num_floors: number, spots_per_floor: number) {
    this.name = name;
    this.floors = Array.from({ length: num_floors }, (_, i) => new ParkingFloor(i, spots_per_floor));
    this.vehicles = new Map();
    this.activity_log = [];
    this.hourly_rate = 10;
  }

  async parkVehicle(reg_num: string, vehicle_type: VehicleType): Promise<[number, number] | null> {
    if (this.vehicles.has(reg_num)) {
      return null;
    }

    const vehicle: Vehicle = {
      reg_num,
      vehicle_type,
      entry_time: new Date(),
      payment_status: PaymentStatus.PENDING,
      assigned_spots: []
    };

    const spots: [number, number][] = [];

    for (const floor of this.floors) {
      const available = await floor.findAvailableSpots(vehicle_type);
      if (available.length >= (vehicle_type <= VehicleType.CAR ? 1 : 2)) {
        for (const spot of available) {
          spot.is_occupied = true;
          spot.vehicle = vehicle;
          spot.vehicle_type = vehicle_type;
          vehicle.assigned_spots.push([floor.floor_id, spot.spot_id]);
          spots.push([floor.floor_id, spot.spot_id]);
        }
        break;
      }
    }

    if (spots.length > 0) {
      this.vehicles.set(reg_num, vehicle);
      this.activity_log.push({
        registration: reg_num,
        entry_time: vehicle.entry_time,
        amount_paid: 0
      });
      return spots[0];
    }
    return null;
  }

  async removeVehicle(reg_num: string): Promise<boolean> {
    const vehicle = this.vehicles.get(reg_num);
    if (!vehicle) return false;

    if (vehicle.payment_status !== PaymentStatus.COMPLETED) {
      return false;
    }

    for (const [floor_id, spot_id] of vehicle.assigned_spots) {
      const floor = this.floors[floor_id];
      const spot = floor.spots[spot_id];
      spot.is_occupied = false;
      spot.vehicle = undefined;
      spot.vehicle_type = undefined;
    }

    vehicle.exit_time = new Date();
    this.vehicles.delete(reg_num);

    // Update activity log
    const activity = this.activity_log.find(a => a.registration === reg_num);
    if (activity) {
      activity.exit_time = vehicle.exit_time;
    }

    return true;
  }

  async processPayment(reg_num: string): Promise<boolean> {
    const vehicle = this.vehicles.get(reg_num);
    if (!vehicle) return false;

    if (vehicle.payment_status === PaymentStatus.COMPLETED) {
      return true;
    }

    // Calculate payment
    const duration = (new Date().getTime() - vehicle.entry_time.getTime()) / (1000 * 60 * 60);
    const amount = Math.round(duration * this.hourly_rate * 100) / 100;

    vehicle.payment_status = PaymentStatus.COMPLETED;

    // Update activity log
    const activity = this.activity_log.find(a => a.registration === reg_num);
    if (activity) {
      activity.amount_paid = amount;
    }

    return true;
  }

  async getAvailability(vehicle_type: VehicleType): Promise<Record<number, number>> {
    const availability: Record<number, number> = {};
    
    for (const floor of this.floors) {
      let count = 0;
      const required = vehicle_type <= VehicleType.CAR ? 1 : 2;
      let consecutive = 0;
      
      for (const spot of floor.spots) {
        if (!spot.is_occupied && (!spot.vehicle_type || spot.vehicle_type === vehicle_type)) {
          consecutive++;
          if (consecutive === required) {
            count++;
            consecutive = 0;
          }
        } else {
          consecutive = 0;
        }
      }
      availability[floor.floor_id] = count;
    }
    return availability;
  }

  async getParkingHistory(): Promise<ParkingActivity[]> {
    return [...this.activity_log];
  }

  async getVehicleInfo(reg_num: string): Promise<Record<string, any> | null> {
    const vehicle = this.vehicles.get(reg_num);
    if (!vehicle) return null;

    return {
      registration: vehicle.reg_num,
      type: VehicleType[vehicle.vehicle_type],
      entry_time: vehicle.entry_time,
      payment_status: vehicle.payment_status,
      assigned_spots: vehicle.assigned_spots
    };
  }
}