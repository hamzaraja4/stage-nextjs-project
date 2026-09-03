import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const search = new URL(request.url).searchParams.get("search")?.trim();
    const hotTemps = await prisma.hotTempLog.findMany({
      where: search ? { dishOrDevice: { contains: search } } : undefined,
      orderBy: { recordedAt: "desc" },
    });
    const [coldRooms, sampleMeals] = await Promise.all([
      prisma.coldRoom.findMany({ orderBy: { name: "asc" } }),
      prisma.sampleMeal.findMany({ orderBy: { sampledDate: "desc" } }),
    ]);
    return NextResponse.json({ success: true, hotTemps, coldRooms, sampleMeals });
  } catch (error) {
    console.error("Error fetching HACCP data:", error);
    return NextResponse.json({ success: false, error: "Impossible de récupérer les contrôles HACCP." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = String(body.action || "");
    if (action === "CREATE_TEMPERATURE") {
      const dishOrDevice = String(body.dishOrDevice || "").trim();
      const temperature = Number(body.temperature);
      if (!dishOrDevice || !Number.isFinite(temperature)) {
        return NextResponse.json({ success: false, error: "Préparation et température obligatoires." }, { status: 400 });
      }
      const hotTemp = await prisma.hotTempLog.create({
        data: { dishOrDevice, temperature, isCompliant: temperature >= 63 },
      });
      return NextResponse.json({ success: true, hotTemp }, { status: 201 });
    }
    if (action === "UPDATE_TEMPERATURE" && body.id) {
      const temperature = Number(body.temperature);
      const hotTemp = await prisma.hotTempLog.update({
        where: { id: String(body.id) },
        data: { dishOrDevice: String(body.dishOrDevice || "").trim(), temperature, isCompliant: temperature >= 63 },
      });
      return NextResponse.json({ success: true, hotTemp });
    }
    if (action === "DELETE_TEMPERATURE" && body.id) {
      await prisma.hotTempLog.delete({ where: { id: String(body.id) } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: "Action HACCP inconnue." }, { status: 400 });
  } catch (error) {
    console.error("Error updating HACCP data:", error);
    return NextResponse.json({ success: false, error: "Impossible d'enregistrer le contrôle HACCP." }, { status: 500 });
  }
}