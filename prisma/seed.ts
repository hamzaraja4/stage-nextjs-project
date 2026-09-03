import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  }),
});

async function main() {
  console.log("🌱 Starting Database Seed for HIS Catering Restauration...");

  // 1. Roles
  const chefRole = await prisma.role.upsert({
    where: { name: "Chef Cuisine / Économe" },
    update: {},
    create: {
      name: "Chef Cuisine / Économe",
      type: "CHEF_CUISINE",
    },
  });

  const soignantRole = await prisma.role.upsert({
    where: { name: "Soignant d'Étage (Infirmier)" },
    update: {},
    create: {
      name: "Soignant d'Étage (Infirmier)",
      type: "SOIGNANT_ETAGE",
    },
  });

  const caisseRole = await prisma.role.upsert({
    where: { name: "Agent Caisse Self & Restauration" },
    update: {},
    create: {
      name: "Agent Caisse Self & Restauration",
      type: "AGENT_CAISSE",
    },
  });

  const directionRole = await prisma.role.upsert({
    where: { name: "Direction Médicale & Qualité" },
    update: {},
    create: {
      name: "Direction Médicale & Qualité",
      type: "DIRECTION_QUALITE",
    },
  });

  // 2. Services
  const chirurgie = await prisma.serviceUnit.upsert({
    where: { code: "chirurgie" },
    update: {},
    create: {
      code: "chirurgie",
      name: "Chirurgie",
      floor: "Étage 1",
    },
  });

  const medecine = await prisma.serviceUnit.upsert({
    where: { code: "medecine" },
    update: {},
    create: {
      code: "medecine",
      name: "Médecine Interne",
      floor: "Étage 2",
    },
  });

  const maternite = await prisma.serviceUnit.upsert({
    where: { code: "maternite" },
    update: {},
    create: {
      code: "maternite",
      name: "Maternité",
      floor: "Étage 3",
    },
  });

  // 3. Rooms & Beds
  const room101 = await prisma.room.create({
    data: { number: "101", serviceUnitId: chirurgie.id },
  });
  const bed101A = await prisma.bed.create({
    data: { code: "Lit A", roomId: room101.id },
  });

  const room104 = await prisma.room.create({
    data: { number: "104", serviceUnitId: chirurgie.id },
  });
  const bed104B = await prisma.bed.create({
    data: { code: "Lit B", roomId: room104.id },
  });

  const room208 = await prisma.room.create({
    data: { number: "208", serviceUnitId: medecine.id },
  });
  const bed208A = await prisma.bed.create({
    data: { code: "Lit A", roomId: room208.id },
  });

  const room302 = await prisma.room.create({
    data: { number: "302", serviceUnitId: maternite.id },
  });
  const bed302B = await prisma.bed.create({
    data: { code: "Lit B", roomId: room302.id },
  });

  // 4. Diets
  const dietNormal = await prisma.diet.upsert({
    where: { code: "normal" },
    update: {},
    create: {
      code: "normal",
      name: "Normal (Standard)",
      texture: "Normale",
    },
  });

  const dietDiab = await prisma.diet.upsert({
    where: { code: "diabetique" },
    update: {},
    create: {
      code: "diabetique",
      name: "Diabétique",
      texture: "Sans sucre",
    },
  });

  const dietSansSel = await prisma.diet.upsert({
    where: { code: "sans-sel" },
    update: {},
    create: {
      code: "sans-sel",
      name: "Sans Sel Strict",
      texture: "Normale",
    },
  });

  const dietPostPartum = await prisma.diet.upsert({
    where: { code: "post-partum" },
    update: {},
    create: {
      code: "post-partum",
      name: "Normal (Post-Partum)",
      texture: "Normale",
    },
  });

  // 5. Patients
  const patient1 = await prisma.patient.upsert({
    where: { ipp: "2026-9812" },
    update: {},
    create: {
      ipp: "2026-9812",
      firstName: "Amine",
      lastName: "TAZI",
      serviceUnitId: chirurgie.id,
      bedId: bed101A.id,
      dietId: dietNormal.id,
      isAJeun: false,
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { ipp: "2026-9492" },
    update: {},
    create: {
      ipp: "2026-9492",
      firstName: "Youssef",
      lastName: "EL AMRI",
      serviceUnitId: chirurgie.id,
      bedId: bed104B.id,
      dietId: dietDiab.id,
      isAJeun: true,
      aJeunReason: "Consigné À JEUN par le Bloc Opératoire",
    },
  });

  const patient3 = await prisma.patient.upsert({
    where: { ipp: "2026-8831" },
    update: {},
    create: {
      ipp: "2026-8831",
      firstName: "Khadija",
      lastName: "BENJELLOUN",
      serviceUnitId: medecine.id,
      bedId: bed208A.id,
      dietId: dietSansSel.id,
      isAJeun: false,
    },
  });

  const patient4 = await prisma.patient.upsert({
    where: { ipp: "2026-7719" },
    update: {},
    create: {
      ipp: "2026-7719",
      firstName: "Salma",
      lastName: "KADIRI",
      serviceUnitId: maternite.id,
      bedId: bed302B.id,
      dietId: dietPostPartum.id,
      isAJeun: false,
    },
  });

  // 6. Trays
  await prisma.tray.upsert({
    where: { qrToken: "9812-7A" },
    update: {},
    create: {
      patientId: patient1.id,
      dietId: dietNormal.id,
      qrToken: "9812-7A",
      status: "SCELLE_QR",
      mealService: "Déjeuner",
      starter: "Salade composée méditerranéenne",
      mainCourse: "Pavé de saumon au beurre fin (140g)",
      sideDish: "Riz pilaf & Haricots verts vapeur",
      dessert: "Yaourt aux fruits rouges",
      allergens: "Aucun",
    },
  });

  await prisma.tray.upsert({
    where: { qrToken: "9492-BLOCKED" },
    update: {},
    create: {
      patientId: patient2.id,
      dietId: dietDiab.id,
      qrToken: "9492-BLOCKED",
      status: "A_JEUN_BLOQUE",
      mealService: "Déjeuner",
      mainCourse: "Blanc de volaille poché & Légumes sans sucre",
      isBlocked: true,
      allergens: "Aucun",
    },
  });

  await prisma.tray.upsert({
    where: { qrToken: "8831-2B" },
    update: {},
    create: {
      patientId: patient3.id,
      dietId: dietSansSel.id,
      qrToken: "8831-2B",
      status: "SCELLE_QR",
      mealService: "Déjeuner",
      starter: "Carottes râpées citron",
      mainCourse: "Pavé de saumon vapeur sans sel",
      sideDish: "Riz blanc & Légumes frais",
      dessert: "Fruit de saison",
      isExtraAccompagnant: true,
      extraDescription: "Repas Normal complet (Débit RACC_DEJ validé)",
    },
  });

  await prisma.tray.upsert({
    where: { qrToken: "7719-3M" },
    update: {},
    create: {
      patientId: patient4.id,
      dietId: dietPostPartum.id,
      qrToken: "7719-3M",
      status: "SCELLE_QR",
      mealService: "Déjeuner",
      starter: "Velouté de potiron & graines",
      mainCourse: "Blanc de volaille rôti aux herbes",
      sideDish: "Purée maison & Haricots verts",
      dessert: "Compote pomme-poire & Yaourt",
      allergens: "Aucun",
    },
  });

  // 7. Carts
  await prisma.cart.upsert({
    where: { code: "ISO-01" },
    update: {},
    create: {
      code: "ISO-01",
      serviceUnitId: chirurgie.id,
      traysCount: 28,
      tempHot: 66.4,
      tempCold: 2.8,
      status: "EN_DISTRIBUTION",
      scannedBy: "Agent Omar",
      departureTime: new Date(),
    },
  });

  await prisma.cart.upsert({
    where: { code: "ISO-02" },
    update: {},
    create: {
      code: "ISO-02",
      serviceUnitId: medecine.id,
      traysCount: 32,
      tempHot: 65.1,
      tempCold: 2.5,
      status: "SCELLE_VALIDE",
      scannedBy: "Agent Karim",
    },
  });

  await prisma.emergencyFridge.upsert({
    where: { name: "Frigo Relais Urgences / Chirurgie" },
    update: {},
    create: {
      name: "Frigo Relais Urgences / Chirurgie",
      service: "Chirurgie",
      availableTrays: 3,
      lastConsumedInfo: "1 consommé à 23:14 (Ch. 109)",
    },
  });

  await prisma.emergencyFridge.upsert({
    where: { name: "Frigo Relais Médecine / Maternité" },
    update: {},
    create: {
      name: "Frigo Relais Médecine / Maternité",
      service: "Médecine / Maternité",
      availableTrays: 4,
    },
  });

  // 8. Staff Member & POS
  const staff = await prisma.staffMember.upsert({
    where: { matricule: "RH-4091" },
    update: {},
    create: {
      name: "Dr. Mehdi ALAMI",
      role: "Chirurgien",
      matricule: "RH-4091",
      balance: 145.0,
    },
  });

  await prisma.posArticle.createMany({
    data: [
      {
        name: "Formule Complète Personnel",
        subtitle: "Entrée + Plat + Dessert + Pain",
        price: 35.0,
        icon: "🍱",
      },
      {
        name: "Plat Protéiné Seul",
        subtitle: "Viande/Poisson du jour",
        price: 22.0,
        icon: "🥩",
      },
      {
        name: "Salade Bar / Entrée",
        subtitle: "Au choix au buffet",
        price: 10.0,
        icon: "🥗",
      },
      {
        name: "Dessert Maison / Fruit",
        subtitle: "Pâtisserie ou Yaourt",
        price: 8.0,
        icon: "🍮",
      },
      {
        name: "Boisson / Café",
        subtitle: "Distributeur self",
        price: 5.0,
        icon: "☕",
      },
      {
        name: "Collation Garde Nuit",
        subtitle: "Prise en charge 100% Clinique",
        price: 0.0,
        icon: "🌙",
        isNightShift: true,
      },
    ],
  });

  // 9. Stock Items & Purchase Orders
  await prisma.stockItem.createMany({
    data: [
      {
        name: "Pavé de Saumon Frais 140g",
        physicalStock: 4.2,
        unit: "Kg",
        thresholdStock: 15.0,
        dlc: new Date("2026-08-21"),
        statusAlert: "🔴 BC Généré Auto",
      },
      {
        name: "Blanc de Volaille Découpé",
        physicalStock: 8.5,
        unit: "Kg",
        thresholdStock: 12.0,
        dlc: new Date("2026-08-22"),
        statusAlert: "⚠️ Seuil Atteint",
      },
      {
        name: "Riz Blanc Long Grain Extra",
        physicalStock: 45.0,
        unit: "Kg",
        thresholdStock: 20.0,
        dlc: new Date("2026-12-15"),
        statusAlert: "🟢 Confortable",
      },
      {
        name: "Yaourt Nature 125g",
        physicalStock: 120.0,
        unit: "Unités",
        thresholdStock: 50.0,
        dlc: new Date("2026-08-28"),
        statusAlert: "🟢 Confortable",
      },
    ],
  });

  await prisma.purchaseOrder.upsert({
    where: { code: "BC-2026-0891" },
    update: {},
    create: {
      code: "BC-2026-0891",
      supplier: "Marée Atlantique SARL",
      itemDetails: "Pavé Saumon (Qté : 25 Kg arrondis)",
      amount: 2850.0,
      status: "GENERE",
    },
  });

  // 10. HACCP
  await prisma.coldRoom.createMany({
    data: [
      {
        name: "Chambre Froide Positive #1 (Produits Frais)",
        type: "Positive",
        temperature: 2.8,
        normMin: 2.0,
        normMax: 4.0,
      },
      {
        name: "Chambre Froide Négative #2 (Surgelés)",
        type: "Négative",
        temperature: -19.4,
        normMin: -25.0,
        normMax: -18.0,
      },
    ],
  });

  await prisma.sampleMeal.createMany({
    data: [
      {
        mealService: "Déjeuner J (Mercredi)",
        content: "Saumon / Volaille / Velouté",
        daysLeft: 7,
      },
      {
        mealService: "Dîner J-1 (Mardi)",
        content: "Gratin de courgettes & Bœuf",
        daysLeft: 6,
      },
      {
        mealService: "Déjeuner J-2 (Lundi)",
        content: "Tajine de dinde aux légumes",
        daysLeft: 5,
      },
    ],
  });

  await prisma.hotTempLog.createMany({
    data: [
      {
        dishOrDevice: "Cuisson Saumon Four Vapeur",
        temperature: 72.0,
      },
      {
        dishOrDevice: "Marmite Velouté de Légumes",
        temperature: 78.5,
      },
      {
        dishOrDevice: "Chariot Bains-Marie Maintien",
        temperature: 67.2,
      },
    ],
  });

  console.log("✅ Database Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
