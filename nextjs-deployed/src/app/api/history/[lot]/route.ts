import { NextResponse } from "next/server";
import { parkingService } from "@/lib/parking-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lot: string }> }
) {
  try {
    const { lot: lotName } = await params;
    const lot = parkingService.getParkingLot(lotName);

    if (!lot) {
      return NextResponse.json(
        { success: false, message: "Lot not found" },
        { status: 404 }
      );
    }

    const history = await lot.getParkingHistory();

    return NextResponse.json({
      success: true,
      history: history.map((activity) => ({
        registration: activity.registration,
        entry_time: activity.entry_time,
        exit_time: activity.exit_time,
        amount_paid: activity.amount_paid,
      })),
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
