/*
  Warnings:

  - You are about to drop the column `isActive` on the `faqs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."faqs_isActive_idx";

-- AlterTable
ALTER TABLE "public"."faqs" DROP COLUMN "isActive";
