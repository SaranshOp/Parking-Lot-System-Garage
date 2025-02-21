import { NextResponse } from "next/server";
import { parkingService } from "@/lib/parking-service";

export async function GET(
  request: Request,
  { params }: { params: { lot: string; reg: string } }
) {
  try {
    const lot = parkingService.getParkingLot(params.lot);
    if (!lot) {
      return NextResponse.json(
        { success: false, message: "Lot not found" },
        { status: 404 }
      );
    }

    const info = await lot.getVehicleInfo(params.reg);
    if (!info) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
