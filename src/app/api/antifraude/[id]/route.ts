import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const log = await prisma.auditLog.update({ where: { id }, data: {
      patientName: String(body.patientName || "").trim(), ipp: String(body.ipp || "").trim(), location: String(body.location || "").trim(), agentName: String(body.agentName || "").trim(), mealType: String(body.mealType || "").trim(), scanResult: String(body.scanResult || "").trim(), scanDuration: String(body.scanDuration || "").trim(), status: String(body.status || "").trim(),
    } });
    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error("Error updating antifraud log:", error);
    return NextResponse.json({ success: false, error: "Enregistrement introuvable ou non modifiable." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    await prisma.auditLog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting antifraud log:", error);
    return NextResponse.json({ success: false, error: "Enregistrement introuvable." }, { status: 404 });
  }
}