-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "maintenanceMode" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);
