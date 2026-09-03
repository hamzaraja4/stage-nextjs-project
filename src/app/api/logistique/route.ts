import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const carts = await prisma.cart.findMany({
      include: {
        serviceUnit: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const fridges = await prisma.emergencyFridge.findMany();

    return NextResponse.json({
      success: true,
      carts,
      fridges,
    });
  } catch (error) {
    console.error("Error in logistique API:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, code, serviceUnitCode, traysCount, tempHot, tempCold, agentName } = body;

    if (action === "CREATE_CART_DEPARTURE") {
      const service = await prisma.serviceUnit.findFirst({
        where: { code: serviceUnitCode || "chirurgie" },
      });

      if (!service) {
        return NextResponse.json(
          { success: false, error: "Service hospitalier introuvable" },
          { status: 400 }
        );
      }

      const newCart = await prisma.cart.create({
        data: {
          code: code || `ISO-${String(Date.now()).slice(-2)}`,
          serviceUnitId: service.id,
          traysCount: Number(traysCount) || 25,
          tempHot: Number(tempHot) || 67.2,
          tempCold: Number(tempCold) || 2.4,
          status: "EN_DISTRIBUTION",
          scannedBy: agentName || "Agent Cuisine",
          departureTime: new Date(),
        },
      });

      return NextResponse.json({ success: true, cart: newCart });
    }

    if (action === "RECORD_NIGHT_CONSUMPTION") {
      const { fridgeId, patientIpp, room } = body;
      const fridge = await prisma.emergencyFridge.findUnique({
        where: { id: fridgeId },
      });

      if (fridge && fridge.availableTrays > 0) {
        const updated = await prisma.emergencyFridge.update({
          where: { id: fridgeId },
          data: {
            availableTrays: fridge.availableTrays - 1,
            lastConsumedAt: new Date(),
            lastConsumedInfo: `IPP ${patientIpp || "2026-9999"} (${room || "Urgences"}) à ${new Date().toLocaleTimeString().slice(0, 5)}`,
          },
        });
        return NextResponse.json({ success: true, fridge: updated });
      }
    }

    return NextResponse.json({ success: false, error: "Action non reconnue" }, { status: 400 });
  } catch (error) {
    console.error("Error creating cart departure:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
