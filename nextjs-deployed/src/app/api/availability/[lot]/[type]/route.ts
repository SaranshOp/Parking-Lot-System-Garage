import { NextResponse } from 'next/server';
import { parkingService } from '@/lib/parking-service';
import { VehicleType } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { lot: string; type: string } }
) {
  try {
    const lot = parkingService.getParkingLot(params.lot);
    if (!lot) {
      return NextResponse.json({ success: false, message: "Lot not found" }, { status: 404 });
    }
    
    const vehicleType = VehicleType[params.type as keyof typeof VehicleType];
    const availability = await lot.getAvailability(vehicleType);
    
    return NextResponse.json({
      lot: params.lot,
      vehicle_type: params.type,
      availability
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}