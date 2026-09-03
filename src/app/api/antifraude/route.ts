import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const auditLogs = await prisma.auditLog.findMany({
      where: search
        ? {
            OR: [
              { patientName: { contains: search } },
              { ipp: { contains: search } },
              { agentName: { contains: search } },
              { location: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      logs: auditLogs,
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
