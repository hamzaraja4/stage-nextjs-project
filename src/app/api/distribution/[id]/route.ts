import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const tray = await prisma.tray.findUnique({
    where: { id },
    include: { patient: true, diet: true },
  });
  if (!tray) return NextResponse.json({ success: false, error: "Distribution introuvable." }, { status: 404 });
  return NextResponse.json({ success: true, tray });
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = {
      mealService: String(body.mealService || "").trim(),
      starter: body.starter ? String(body.starter) : null,
      mainCourse: body.mainCourse ? String(body.mainCourse) : null,
      sideDish: body.sideDish ? String(body.sideDish) : null,
      dessert: body.dessert ? String(body.dessert) : null,
      allergens: body.allergens ? String(body.allergens) : "Aucun",
      status: body.status ? String(body.status) : undefined,
    };
    if (!data.mealService) return NextResponse.json({ success: false, error: "Le service repas est obligatoire." }, { status: 400 });
    const tray = await prisma.tray.update({ where: { id }, data });
    return NextResponse.json({ success: true, tray });
  } catch (error) {
    console.error("Error updating distribution:", error);
    return NextResponse.json({ success: false, error: "Distribution introuvable ou non modifiable." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await prisma.tray.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting distribution:", error);
    return NextResponse.json({ success: false, error: "Distribution introuvable." }, { status: 404 });
  }
}