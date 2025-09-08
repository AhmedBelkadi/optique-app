/*
  Warnings:

  - You are about to drop the column `categoryMetaDescription` on the `seo_settings` table. All the data in the column will be lost.
  - You are about to drop the column `categoryMetaTitle` on the `seo_settings` table. All the data in the column will be lost.
  - You are about to drop the column `productMetaDescription` on the `seo_settings` table. All the data in the column will be lost.
  - You are about to drop the column `productMetaTitle` on the `seo_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."seo_settings" DROP COLUMN "categoryMetaDescription",
DROP COLUMN "categoryMetaTitle",
DROP COLUMN "productMetaDescription",
DROP COLUMN "productMetaTitle",
ADD COLUMN     "about" JSONB,
ADD COLUMN     "appointment" JSONB,
ADD COLUMN     "canonicalBaseUrl" TEXT,
ADD COLUMN     "contact" JSONB,
ADD COLUMN     "faq" JSONB,
ADD COLUMN     "googleSearchConsole" TEXT,
ADD COLUMN     "homepage" JSONB,
ADD COLUMN     "productDetails" JSONB,
ADD COLUMN     "products" JSONB,
ADD COLUMN     "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "testimonials" JSONB;
