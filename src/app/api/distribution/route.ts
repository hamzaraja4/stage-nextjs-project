import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [trays, patients, diets] = await Promise.all([
      prisma.tray.findMany({
      include: {
        patient: {
          include: {
            serviceUnit: true,
            bed: {
              include: {
                room: true,
              },
            },
            diet: true,
          },
        },
        diet: true,
      },
      orderBy: { createdAt: "desc" },
      }),
      prisma.patient.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
      prisma.diet.findMany({ orderBy: { name: "asc" } }),
    ]);

    const totalCount = trays.length;
    const blockedCount = trays.filter(
      (t) => t.isBlocked || t.status === "A_JEUN_BLOQUE"
    ).length;
    const dressedCount = trays.filter(
      (t) => t.status === "SCELLE_QR" || t.status === "PRET_DEPART"
    ).length;

    return NextResponse.json({
      success: true,
      trays,
      patients,
      diets,
      stats: {
        total: totalCount,
        dressed: dressedCount,
        blocked: blockedCount,
        buffer: trays.filter((t) => t.status === "PREPARATION").length,
      },
    });
  } catch (error) {
    console.error("Error fetching distribution trays:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de récupérer les plateaux" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, trayId, patientName, status, reason } = body;

    if (action === "CREATE") {
      const patientId = String(body.patientId || "");
      const dietId = String(body.dietId || "");
      const qrToken = String(body.qrToken || "").trim();
      const mealService = String(body.mealService || "").trim();
      if (!patientId || !dietId || !qrToken || !mealService) {
        return NextResponse.json(
          { success: false, error: "Patient, régime, token QR et service repas sont obligatoires." },
          { status: 400 }
        );
      }
      const [patient, diet] = await Promise.all([
        prisma.patient.findUnique({ where: { id: patientId } }),
        prisma.diet.findUnique({ where: { id: dietId } }),
      ]);
      if (!patient || !diet) {
        return NextResponse.json({ success: false, error: "Patient ou régime introuvable." }, { status: 400 });
      }
      const existingToken = await prisma.tray.findUnique({ where: { qrToken } });
      if (existingToken) {
        return NextResponse.json({ success: false, error: "Ce token QR est déjà utilisé." }, { status: 409 });
      }
      const tray = await prisma.tray.create({
        data: {
          patientId,
          dietId,
          qrToken,
          mealService,
          starter: body.starter ? String(body.starter) : null,
          mainCourse: body.mainCourse ? String(body.mainCourse) : null,
          sideDish: body.sideDish ? String(body.sideDish) : null,
          dessert: body.dessert ? String(body.dessert) : null,
          allergens: body.allergens ? String(body.allergens) : "Aucun",
        },
      });
      return NextResponse.json({ success: true, tray }, { status: 201 });
    }

    if (action === "TRIGGER_A_JEUN") {
      // Find patient and mark à jeun
      const patient = await prisma.patient.findFirst({
        where: {
          OR: [
            { lastName: { contains: patientName || "" } },
            { firstName: { contains: patientName || "" } },
          ],
        },
      });

      if (!patient) {
        return NextResponse.json({ success: false, error: "Patient introuvable." }, { status: 404 });
      }

      await prisma.patient.update({
          where: { id: patient.id },
          data: { isAJeun: true, aJeunReason: reason || "Bloc Opératoire" },
      });

        // Block all their pending trays
      await prisma.tray.updateMany({
          where: { patientId: patient.id },
          data: { isBlocked: true, status: "A_JEUN_BLOQUE" },
      });

        // Log in AuditLog
      await prisma.auditLog.create({
          data: {
            patientId: patient.id,
            patientName: `${patient.firstName} ${patient.lastName}`,
            ipp: patient.ipp,
            location: "Chirurgie • Ch. 104 Lit B",
            agentName: "Bloc Opératoire (HIS)",
            mealType: "Déjeuner",
            scanResult: "BLOQUÉ À JEUN",
            scanDuration: "140ms",
            status: "Alerte Émise",
          },
      });

      return NextResponse.json({
        success: true,
        message: `Patient ${patientName} consigné À JEUN avec succès.`,
      });
    }

    if (action === "UPDATE_STATUS" && trayId) {
      const updated = await prisma.tray.update({
        where: { id: trayId },
        data: { status: status || "PRET_DEPART" },
      });
      return NextResponse.json({ success: true, tray: updated });
    }

    return NextResponse.json({ success: false, error: "Action inconnue" }, { status: 400 });
  } catch (error) {
    console.error("Error updating distribution tray:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du traitement de la requête" },
      { status: 500 }
    );
  }
}
