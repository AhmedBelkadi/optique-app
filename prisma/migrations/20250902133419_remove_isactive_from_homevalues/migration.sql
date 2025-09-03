/*
  Warnings:

  - You are about to drop the column `isActive` on the `home_values` table. All the data in the column will be lost.
  - You are about to drop the `home_sections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "public"."home_values_isActive_idx";

-- AlterTable
ALTER TABLE "public"."home_values" DROP COLUMN "isActive";

-- DropTable
DROP TABLE "public"."home_sections";
