-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ServiceUnit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "floor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "serviceUnitId" TEXT NOT NULL,
    CONSTRAINT "Room_serviceUnitId_fkey" FOREIGN KEY ("serviceUnitId") REFERENCES "ServiceUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bed" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    CONSTRAINT "Bed_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Diet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "texture" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ipp" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "serviceUnitId" TEXT NOT NULL,
    "bedId" TEXT NOT NULL,
    "dietId" TEXT NOT NULL,
    "isAJeun" BOOLEAN NOT NULL DEFAULT false,
    "aJeunReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Patient_serviceUnitId_fkey" FOREIGN KEY ("serviceUnitId") REFERENCES "ServiceUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Patient_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "Bed" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Patient_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "Diet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tray" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "dietId" TEXT NOT NULL,
    "qrToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PREPARATION',
    "mealService" TEXT NOT NULL,
    "starter" TEXT,
    "mainCourse" TEXT,
    "sideDish" TEXT,
    "dessert" TEXT,
    "allergens" TEXT DEFAULT 'Aucun',
    "isExtraAccompagnant" BOOLEAN NOT NULL DEFAULT false,
    "extraDescription" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "cartId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Tray_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tray_dietId_fkey" FOREIGN KEY ("dietId") REFERENCES "Diet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tray_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "serviceUnitId" TEXT NOT NULL,
    "traysCount" INTEGER NOT NULL DEFAULT 0,
    "tempHot" REAL NOT NULL,
    "tempCold" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PREPARATION',
    "scannedBy" TEXT,
    "departureTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_serviceUnitId_fkey" FOREIGN KEY ("serviceUnitId") REFERENCES "ServiceUnit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmergencyFridge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "capacityTrays" INTEGER NOT NULL DEFAULT 4,
    "capacitySnacks" INTEGER NOT NULL DEFAULT 4,
    "availableTrays" INTEGER NOT NULL DEFAULT 4,
    "lastConsumedAt" DATETIME,
    "lastConsumedInfo" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT,
    "patientName" TEXT NOT NULL,
    "ipp" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "scanResult" TEXT NOT NULL,
    "scanDuration" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "AuditLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StaffMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "balance" REAL NOT NULL DEFAULT 145.00,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PosArticle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "icon" TEXT NOT NULL,
    "isNightShift" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "PosTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "staffMemberId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PosTransaction_staffMemberId_fkey" FOREIGN KEY ("staffMemberId") REFERENCES "StaffMember" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PosTransaction_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "PosArticle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StockItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "physicalStock" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "thresholdStock" REAL NOT NULL,
    "dlc" DATETIME NOT NULL,
    "statusAlert" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "itemDetails" TEXT NOT NULL,
    "amount" REAL,
    "status" TEXT NOT NULL DEFAULT 'GENERE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ColdRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "temperature" REAL NOT NULL,
    "normMin" REAL NOT NULL,
    "normMax" REAL NOT NULL,
    "lastCheckAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sensorType" TEXT NOT NULL DEFAULT 'Sonde IoT Clinique'
);

-- CreateTable
CREATE TABLE "SampleMeal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mealService" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sampledDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysLeft" INTEGER NOT NULL DEFAULT 7,
    "isSealed" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "HotTempLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dishOrDevice" TEXT NOT NULL,
    "temperature" REAL NOT NULL,
    "isCompliant" BOOLEAN NOT NULL DEFAULT true,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceUnit_code_key" ON "ServiceUnit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Diet_code_key" ON "Diet"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_ipp_key" ON "Patient"("ipp");

-- CreateIndex
CREATE UNIQUE INDEX "Tray_qrToken_key" ON "Tray"("qrToken");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_code_key" ON "Cart"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StaffMember_matricule_key" ON "StaffMember"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_code_key" ON "PurchaseOrder"("code");
