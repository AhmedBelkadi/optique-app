/*
  Warnings:

  - You are about to drop the `about_floating_cta` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `highlight` to the `about_benefits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryButtonLink` to the `about_cta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryButtonText` to the `about_cta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondaryButtonLink` to the `about_cta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondaryButtonText` to the `about_cta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."about_benefits" ADD COLUMN     "highlight" TEXT NOT NULL DEFAULT 'Valeur ajoutée';

-- AlterTable
ALTER TABLE "public"."about_cta" ADD COLUMN     "primaryButtonLink" TEXT NOT NULL DEFAULT '/appointment',
ADD COLUMN     "primaryButtonText" TEXT NOT NULL DEFAULT 'Prendre Rendez-vous',
ADD COLUMN     "secondaryButtonLink" TEXT NOT NULL DEFAULT '/products',
ADD COLUMN     "secondaryButtonText" TEXT NOT NULL DEFAULT 'Voir Notre Catalogue';

-- DropTable
DROP TABLE "public"."about_floating_cta";
