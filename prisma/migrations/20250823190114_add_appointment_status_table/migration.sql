/*
  Warnings:

  - You are about to drop the column `status` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `statusId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."appointments_status_idx";

-- AlterTable
ALTER TABLE "public"."appointments" DROP COLUMN "status",
ADD COLUMN     "statusId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."AppointmentStatus";

-- CreateTable
CREATE TABLE "public"."appointment_statuses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6b7280',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appointment_statuses_name_key" ON "public"."appointment_statuses"("name");

-- CreateIndex
CREATE INDEX "appointment_statuses_order_idx" ON "public"."appointment_statuses"("order");

-- CreateIndex
CREATE INDEX "appointment_statuses_isActive_idx" ON "public"."appointment_statuses"("isActive");

-- CreateIndex
CREATE INDEX "appointments_statusId_idx" ON "public"."appointments"("statusId");

-- AddForeignKey
ALTER TABLE "public"."appointments" ADD CONSTRAINT "appointments_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."appointment_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
