import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const search = params.get("search")?.trim();
    const status = params.get("status")?.trim();
    const serviceUnitCode = params.get("service")?.trim();
    const carts = await prisma.cart.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(serviceUnitCode ? { serviceUnit: { code: serviceUnitCode } } : {}),
        ...(search ? { OR: [{ code: { contains: search } }, { scannedBy: { contains: search } }, { serviceUnit: { name: { contains: search } } }] } : {}),
      },
      include: { serviceUnit: true },
      orderBy: { createdAt: "desc" },
    });

    const fridges = await prisma.emergencyFridge.findMany();

    return NextResponse.json({
      success: true,
      carts,
      fridges,
      stats: {
        total: await prisma.cart.count(),
        inDistribution: await prisma.cart.count({ where: { status: "EN_DISTRIBUTION" } }),
        completed: await prisma.cart.count({ where: { status: "TERMINE" } }),
        trays: carts.reduce((total, cart) => total + cart.traysCount, 0),
      },
    });
  } catch (error) {
    console.error("Error in logistique API:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, code, serviceUnitCode, traysCount, tempHot, tempCold, agentName, status } = body;

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

      if (!code || !serviceUnitCode || !agentName || !Number.isInteger(Number(traysCount)) || Number(traysCount) < 0 || !Number.isFinite(Number(tempHot)) || !Number.isFinite(Number(tempCold))) {
        return NextResponse.json({ success: false, error: "Code, service, responsable, quantité et températures valides sont obligatoires." }, { status: 400 });
      }
      const existing = await prisma.cart.findUnique({ where: { code: String(code).trim() } });
      if (existing) return NextResponse.json({ success: false, error: "Ce code chariot existe déjà." }, { status: 409 });
      const newCart = await prisma.cart.create({
        data: {
          code: String(code).trim(),
          serviceUnitId: service.id,
          traysCount: Number(traysCount),
          tempHot: Number(tempHot),
          tempCold: Number(tempCold),
          status: status || "PREPARATION",
          scannedBy: String(agentName).trim(),
          departureTime: status === "EN_DISTRIBUTION" ? new Date() : null,
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
