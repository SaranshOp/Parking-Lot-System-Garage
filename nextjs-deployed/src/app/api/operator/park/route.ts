import { NextResponse } from 'next/server';
import { parkingService } from '@/lib/parking-service';
import { checkRole } from '@/lib/auth';
import { UserRole, VehicleType } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await checkRole([UserRole.ADMIN, UserRole.OPERATOR]);
    const data = await request.json();
    const { lot_name, reg_num, vehicle_type } = data;
    
    const lot = parkingService.getParkingLot(lot_name);
    if (!lot) {
      return NextResponse.json({ success: false, message: "Lot not found" }, { status: 404 });
    }
    
    const spot = await lot.parkVehicle(reg_num, vehicle_type as VehicleType);
    return NextResponse.json({
      success: true,
      message: spot ? `Parked at Floor ${spot[0]} Spot ${spot[1]}` : "No spots available"
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}