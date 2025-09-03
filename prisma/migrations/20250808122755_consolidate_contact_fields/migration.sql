/*
  Warnings:

  - You are about to drop the `contact_info` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "googleMapEmbed" TEXT;

-- DropTable
DROP TABLE "contact_info";
