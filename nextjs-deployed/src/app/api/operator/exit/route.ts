import { NextResponse } from 'next/server';
import { parkingService } from '@/lib/parking-service';
import { checkRole } from '@/lib/auth';
import { UserRole } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await checkRole([UserRole.ADMIN, UserRole.OPERATOR]);
    const data = await request.json();
    const { lot_name, reg_num } = data;
    
    const lot = parkingService.getParkingLot(lot_name);
    if (!lot) {
      return NextResponse.json({ success: false, message: "Lot not found" }, { status: 404 });
    }
    
    const success = await lot.removeVehicle(reg_num);
    return NextResponse.json({
      success,
      message: success ? "Vehicle exited" : "Exit failed"
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}