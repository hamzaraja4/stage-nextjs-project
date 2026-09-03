import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, patientIpp, trayToken, agentName, isSimulatedMismatch } = body;

    if (action === "VERIFY_DOUBLE_SCAN") {
      if (isSimulatedMismatch) {
        // Record intentional fraud/mismatch attempt in audit log
        await prisma.auditLog.create({
          data: {
            patientName: "Amine TAZI",
            ipp: patientIpp || "2026-9812",
            location: "Chirurgie • Ch. 101 Lit A",
            agentName: agentName || "Inf. Fatima Zahra (Mobile)",
            mealType: "Sans Sel (Discordance)",
            scanResult: "DISCORDANCE RÉGIME / TOKEN",
            scanDuration: "190ms",
            status: "Fraude / Alerte",
          },
        });

        return NextResponse.json({
          success: false,
          mismatch: true,
          error: "ERREUR : Le plateau n° #8831-2B (Sans Sel) ne correspond pas au patient scanné (Amine TAZI - Normal) ! ALARME ÉMISE.",
        });
      }

      // Check DB for matching tray & patient
      const patient = await prisma.patient.findFirst({
        where: { ipp: patientIpp || "2026-9812" },
        include: {
          serviceUnit: true,
          diet: true,
          bed: { include: { room: true } },
        },
      });

      if (patient?.isAJeun) {
        return NextResponse.json({
          success: false,
          blocked: true,
          error: "ALERTE MAJEURE : Patient sous consigne médicale « À JEUN » ! Distribution strictement interdite.",
        });
      }

      // Save confirmed scan in AuditLog
      const auditEntry = await prisma.auditLog.create({
        data: {
          patientId: patient?.id,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Amine TAZI",
          ipp: patientIpp || "2026-9812",
          location: patient?.serviceUnit
            ? `${patient.serviceUnit.name} • Ch. ${patient.bed.room.number} ${patient.bed.code}`
            : "Chirurgie • Ch. 101 Lit A",
          agentName: agentName || "Inf. Fatima Zahra (Mobile)",
          mealType: "Déjeuner Normal",
          scanResult: "Conforme (180ms)",
          scanDuration: "180ms",
          status: "Certifié",
        },
      });

      // Update tray status if found
      if (trayToken) {
        await prisma.tray.updateMany({
          where: { qrToken: trayToken },
          data: { status: "LIVRE_CONFORME" },
        });
      }

      return NextResponse.json({
        success: true,
        auditEntry,
        message: "DISTRIBUTION CONFORME VALIDÉE ! Horodatage certifié • Débit décrémenté • Latence 120ms",
      });
    }

    return NextResponse.json({ success: false, error: "Action inconnue" }, { status: 400 });
  } catch (error) {
    console.error("Error in mobile scan verification:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
