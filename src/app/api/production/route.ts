import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function invalid(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function GET(request: Request) {
  try {
    const search = new URL(request.url).searchParams.get("search")?.trim();
    const runs = await prisma.productionRun.findMany({
      where: search ? { OR: [{ code: { contains: search } }, { mealService: { contains: search } }] } : undefined,
      include: { diet: true },
      orderBy: { productionDate: "desc" },
    });
    const stats = {
      total: runs.reduce((sum, run) => sum + run.quantity, 0),
      planned: runs.filter((run) => run.status === "PLANIFIEE").length,
      completed: runs.filter((run) => run.status === "TERMINEE").length,
    };
    return NextResponse.json({ success: true, runs, stats });
  } catch (error) {
    console.error("Error fetching production:", error);
    return invalid("Impossible de récupérer la production.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = String(body.action || "");
    if (action === "CREATE") {
      const mealService = String(body.mealService || "").trim();
      const dietCode = String(body.dietCode || "").trim();
      const quantity = Number(body.quantity);
      if (!mealService || !dietCode || !Number.isInteger(quantity) || quantity <= 0) return invalid("Service, régime et quantité valides obligatoires.");
      const diet = await prisma.diet.findUnique({ where: { code: dietCode } });
      if (!diet) return invalid("Régime introuvable.");
      const run = await prisma.productionRun.create({ data: { code: `PROD-${Date.now()}`, mealService, dietId: diet.id, quantity } });
      return NextResponse.json({ success: true, run }, { status: 201 });
    }
    if (action === "UPDATE" && body.id) {
      const quantity = Number(body.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) return invalid("La quantité doit être un entier positif.");
      const run = await prisma.productionRun.update({ where: { id: String(body.id) }, data: { quantity, status: String(body.status || "PLANIFIEE") } });
      return NextResponse.json({ success: true, run });
    }
    if (action === "DELETE" && body.id) {
      await prisma.productionRun.delete({ where: { id: String(body.id) } });
      return NextResponse.json({ success: true });
    }
    return invalid("Action production inconnue.");
  } catch (error) {
    console.error("Error updating production:", error);
    return invalid("Impossible d'enregistrer la production.", 500);
  }
}
