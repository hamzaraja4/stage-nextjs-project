import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const staff = await prisma.staffMember.findFirst({
      where: { matricule: "RH-4091" },
      include: {
        transactions: {
          include: { article: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    const articles = await prisma.posArticle.findMany();

    return NextResponse.json({
      success: true,
      staff: staff || {
        name: "Dr. Mehdi ALAMI",
        role: "Chirurgien",
        matricule: "RH-4091",
        balance: 145.0,
      },
      articles,
    });
  } catch (error) {
    console.error("Error fetching POS data:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, amount, articleId, matricule } = body;

    const targetMatricule = matricule || "RH-4091";
    let staff = await prisma.staffMember.findUnique({
      where: { matricule: targetMatricule },
    });

    if (!staff) {
      staff = await prisma.staffMember.create({
        data: {
          name: "Dr. Mehdi ALAMI",
          role: "Chirurgien",
          matricule: targetMatricule,
          balance: 145.0,
        },
      });
    }

    if (action === "RECHARGE") {
      const rechargeAmount = Number(amount) || 100;
      const updatedStaff = await prisma.staffMember.update({
        where: { id: staff.id },
        data: { balance: staff.balance + rechargeAmount },
      });

      return NextResponse.json({
        success: true,
        newBalance: updatedStaff.balance,
        message: `Compte rechargé avec succès de +${rechargeAmount} MAD.`,
      });
    }

    if (action === "DEBIT") {
      const debitPrice = Number(amount) || 0;

      if (debitPrice > 0 && staff.balance < debitPrice) {
        return NextResponse.json(
          { success: false, error: "Solde insuffisant sur le badge RFID !" },
          { status: 400 }
        );
      }

      const updatedStaff = await prisma.staffMember.update({
        where: { id: staff.id },
        data: { balance: staff.balance - debitPrice },
      });

      // Record transaction if article is provided
      if (articleId) {
        await prisma.posTransaction.create({
          data: {
            staffMemberId: staff.id,
            articleId,
            amount: debitPrice,
          },
        });
      }

      return NextResponse.json({
        success: true,
        newBalance: updatedStaff.balance,
        message: `Débit RFID validé : ${debitPrice.toFixed(2)} MAD. Nouveau solde : ${updatedStaff.balance.toFixed(2)} MAD.`,
      });
    }

    return NextResponse.json({ success: false, error: "Action inconnue" }, { status: 400 });
  } catch (error) {
    console.error("Error processing POS action:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
