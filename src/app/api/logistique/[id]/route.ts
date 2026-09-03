import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const traysCount = Number(body.traysCount);
    const tempHot = Number(body.tempHot);
    const tempCold = Number(body.tempCold);
    if (!String(body.agentName || "").trim() || !Number.isInteger(traysCount) || traysCount < 0 || !Number.isFinite(tempHot) || !Number.isFinite(tempCold)) {
      return NextResponse.json({ success: false, error: "Données logistiques invalides." }, { status: 400 });
    }
    const cart = await prisma.cart.update({ where: { id }, data: { traysCount, tempHot, tempCold, scannedBy: String(body.agentName).trim(), status: String(body.status || "PREPARATION") } });
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Error updating logistics cart:", error);
    return NextResponse.json({ success: false, error: "Chariot introuvable ou non modifiable." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    await prisma.cart.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting logistics cart:", error);
    return NextResponse.json({ success: false, error: "Chariot introuvable ou lié à des plateaux." }, { status: 409 });
  }
}