import { NextResponse } from 'next/server';
import { parkingService } from '@/lib/parking-service';
import { VehicleType } from '@/lib/types';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const role = cookieStore.get('session_role')?.value;
  
  return NextResponse.json({
    role: role,
    lots: parkingService.listParkingLots(),
    vehicle_types: Object.keys(VehicleType).filter(key => isNaN(Number(key)))
  });
}