import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        ...(search ? { OR: [
          { patientName: { contains: search } },
          { ipp: { contains: search } },
          { agentName: { contains: search } },
          { location: { contains: search } },
          { scanResult: { contains: search } },
        ] } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    const stats = {
      total: await prisma.auditLog.count(),
      fraud: await prisma.auditLog.count({ where: { status: { contains: "Fraude" } } }),
      certified: await prisma.auditLog.count({ where: { status: "Certifié" } }),
    };
    return NextResponse.json({
      success: true,
      logs: auditLogs,
      stats,
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ["patientName", "ipp", "location", "agentName", "mealType", "scanResult", "scanDuration", "status"];
    if (required.some((field) => !String(body[field] || "").trim())) {
      return NextResponse.json({ success: false, error: "Tous les champs obligatoires doivent être renseignés." }, { status: 400 });
    }
    const log = await prisma.auditLog.create({ data: {
      patientName: String(body.patientName).trim(), ipp: String(body.ipp).trim(), location: String(body.location).trim(), agentName: String(body.agentName).trim(), mealType: String(body.mealType).trim(), scanResult: String(body.scanResult).trim(), scanDuration: String(body.scanDuration).trim(), status: String(body.status).trim(),
    } });
    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error) {
    console.error("Error creating antifraud log:", error);
    return NextResponse.json({ success: false, error: "Impossible d'ajouter l'enregistrement." }, { status: 500 });
  }
}
