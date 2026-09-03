import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET(request: Request) {
  try {
    const search = new URL(request.url).searchParams.get("search")?.trim();
    const where = search ? { name: { contains: search } } : undefined;
    const [items, purchaseOrders] = await Promise.all([
      prisma.stockItem.findMany({ where, orderBy: { name: "asc" } }),
      prisma.purchaseOrder.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return NextResponse.json({ success: true, items, purchaseOrders });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return errorResponse("Impossible de récupérer les stocks.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = String(body.action || "");

    if (action === "CREATE_STOCK") {
      const name = String(body.name || "").trim();
      const unit = String(body.unit || "").trim();
      const physicalStock = Number(body.physicalStock);
      const thresholdStock = Number(body.thresholdStock);
      const dlc = new Date(body.dlc);

      if (!name || !unit || !Number.isFinite(physicalStock) || physicalStock < 0 ||
          !Number.isFinite(thresholdStock) || thresholdStock < 0 || Number.isNaN(dlc.getTime())) {
        return errorResponse("Les informations du stock sont invalides.");
      }

      const item = await prisma.stockItem.create({
        data: {
          name,
          unit,
          physicalStock,
          thresholdStock,
          dlc,
          statusAlert: physicalStock <= thresholdStock ? "Seuil Atteint" : "Confortable",
        },
      });
      return NextResponse.json({ success: true, item }, { status: 201 });
    }

    if (action === "UPDATE_STOCK" && body.id) {
      const item = await prisma.stockItem.update({
        where: { id: String(body.id) },
        data: {
          name: String(body.name || "").trim(),
          unit: String(body.unit || "").trim(),
          physicalStock: Number(body.physicalStock),
          thresholdStock: Number(body.thresholdStock),
          dlc: new Date(body.dlc),
        },
      });
      return NextResponse.json({ success: true, item });
    }

    if (action === "DELETE_STOCK" && body.id) {
      await prisma.stockItem.delete({ where: { id: String(body.id) } });
      return NextResponse.json({ success: true });
    }

    if (action === "TRANSMIT_ORDER" && body.id) {
      const order = await prisma.purchaseOrder.update({
        where: { id: String(body.id) },
        data: { status: "TRANSMIS" },
      });
      return NextResponse.json({ success: true, purchaseOrder: order });
    }

    return errorResponse("Action stocks inconnue.");
  } catch (error) {
    console.error("Error updating stocks:", error);
    return errorResponse("Impossible d'enregistrer cette opération.", 500);
  }
}