/*
  Warnings:

  - You are about to drop the column `image` on the `about_sections` table. All the data in the column will be lost.
  - You are about to drop the `seo_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."about_sections" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "public"."site_settings" ADD COLUMN     "imageAboutSection" TEXT;

-- DropTable
DROP TABLE "public"."seo_settings";
