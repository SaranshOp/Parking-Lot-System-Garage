import { ParkingLot } from "./parking-lot";
import { User, UserRole } from "./types";

export class ParkingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParkingError";
  }
}

// Declare global instance type
declare global {
  namespace NodeJS {
    interface Global {
      parkingService: ParkingService;
    }
  }
}

export class ParkingService {
  private parking_lots: Map<string, ParkingLot>;
  private admins: Map<string, string[]>;

  constructor() {
    this.parking_lots = new Map();
    this.admins = new Map();
  }

  createParkingLot(name: string, floors: number, spots: number): ParkingLot {
    if (this.parking_lots.has(name)) {
      throw new ParkingError("Parking lot already exists");
    }

    const lot = new ParkingLot(name, floors, spots);
    this.parking_lots.set(name, lot);

    const user: User = { username: "system_admin", role: UserRole.ADMIN };
    if (!this.admins.has(user.username)) {
      this.admins.set(user.username, []);
    }
    this.admins.get(user.username)?.push(name);

    return lot;
  }

  getParkingLot(name: string): ParkingLot | undefined {
    return this.parking_lots.get(name);
  }

  listParkingLots(): string[] {
    return Array.from(this.parking_lots.keys());
  }

  validateAdminAccess(lot_name: string): boolean {
    return this.parking_lots.has(lot_name);
  }
}

// Create singleton instance
const globalObj = global as typeof globalThis & {
  parkingService?: ParkingService;
};
const parkingService = globalObj.parkingService || new ParkingService();

if (process.env.NODE_ENV !== "production") {
  globalObj.parkingService = parkingService;
}

export { parkingService };
