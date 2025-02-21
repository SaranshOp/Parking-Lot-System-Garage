import { ParkingLot } from "./parking-lot";
import { User, UserRole } from "./types";

export class ParkingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParkingError";
  }
}

// Global type declaration
declare global {
  // eslint-disable-next-line no-var
  var parkingService: ParkingService | undefined;
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
  getParkingLots(): Map<string, ParkingLot> {
    return this.parking_lots;
  }
}

// Singleton pattern implementation
if (typeof global !== "undefined") {
  if (!global.parkingService) {
    global.parkingService = new ParkingService();
  }
}

// Export existing instance or create new one
export const parkingService = global.parkingService || new ParkingService();

// Preserve instance in development
if (process.env.NODE_ENV !== "production" && typeof global !== "undefined") {
  global.parkingService = parkingService;
}
