/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `EmergencyFridge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmergencyFridge_name_key" ON "EmergencyFridge"("name");
