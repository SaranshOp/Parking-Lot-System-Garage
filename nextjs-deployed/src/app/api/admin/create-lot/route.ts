import { NextResponse } from 'next/server';
import { parkingService } from '@/lib/parking-service';
import { checkRole } from '@/lib/auth';
import { UserRole } from '@/lib/types';

export async function POST(request: Request) {
  try {
    await checkRole([UserRole.ADMIN]);
    const data = await request.json();
    const { name, floors, spots } = data;
    
    parkingService.createParkingLot(name, floors, spots);
    
    return NextResponse.json({
      success: true,
      message: `Parking lot '${name}' created successfully`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 403 }
    );
  }
}