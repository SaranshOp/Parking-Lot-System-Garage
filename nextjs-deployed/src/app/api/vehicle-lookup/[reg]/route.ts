import { NextResponse } from "next/server";
import { parkingService } from "@/lib/parking-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reg: string }> }
) {
  try {
    const { reg } = await params;
    const reg_num = reg;

    // Search across all parking lots
    for (const [lot_name, lot] of parkingService.getParkingLots().entries()) {
      const info = await lot.getVehicleInfo(reg_num);
      if (info) {
        return NextResponse.json({
          found: true,
          lot_name: lot_name,
          registration: info.registration,
          floor_id: info.assigned_spots[0][0],
          spot_id: info.assigned_spots[0][1],
          entry_time: info.entry_time.toLocaleString(),
          payment_status: info.payment_status,
        });
      }
    }

    return NextResponse.json({
      found: false,
      message: "Vehicle not found in any parking lot",
    });
  } catch (error) {
    console.error("Error looking up vehicle:", error);
    return NextResponse.json(
      {
        found: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
