/*
  Warnings:

  - You are about to drop the column `accentColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `borderColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `cardBackgroundColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `decorativeElement1Color` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `decorativeElement2Color` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `decorativeElement3Color` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `errorColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `floatingCTAGlowColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `floatingCTAParticlesColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `foregroundColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `heroBadgeBackground` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `heroBadgeText` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `heroOverlayEndColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `heroOverlayMiddleColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `heroOverlayStartColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `heroScrollIndicatorColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `infoColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `mutedBackgroundColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `mutedForegroundColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `popoverBackgroundColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `popoverForegroundColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `productsCategoryBadgeBackground` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `productsCategoryBadgeText` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `productsNewBadgeColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `productsPopularBadgeColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `successColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialsBadgeBackground` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialsBadgeText` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialsStarColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialsVerifiedBadgeColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `warningColor` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeBadgeBackground` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeBadgeText` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeFeatureIcon1Color` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeFeatureIcon2Color` on the `theme_settings` table. All the data in the column will be lost.
  - You are about to drop the column `welcomeFeatureIcon3Color` on the `theme_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."theme_settings" DROP COLUMN "accentColor",
DROP COLUMN "backgroundColor",
DROP COLUMN "borderColor",
DROP COLUMN "cardBackgroundColor",
DROP COLUMN "decorativeElement1Color",
DROP COLUMN "decorativeElement2Color",
DROP COLUMN "decorativeElement3Color",
DROP COLUMN "errorColor",
DROP COLUMN "floatingCTAGlowColor",
DROP COLUMN "floatingCTAParticlesColor",
DROP COLUMN "foregroundColor",
DROP COLUMN "heroBadgeBackground",
DROP COLUMN "heroBadgeText",
DROP COLUMN "heroOverlayEndColor",
DROP COLUMN "heroOverlayMiddleColor",
DROP COLUMN "heroOverlayStartColor",
DROP COLUMN "heroScrollIndicatorColor",
DROP COLUMN "infoColor",
DROP COLUMN "mutedBackgroundColor",
DROP COLUMN "mutedForegroundColor",
DROP COLUMN "popoverBackgroundColor",
DROP COLUMN "popoverForegroundColor",
DROP COLUMN "productsCategoryBadgeBackground",
DROP COLUMN "productsCategoryBadgeText",
DROP COLUMN "productsNewBadgeColor",
DROP COLUMN "productsPopularBadgeColor",
DROP COLUMN "successColor",
DROP COLUMN "testimonialsBadgeBackground",
DROP COLUMN "testimonialsBadgeText",
DROP COLUMN "testimonialsStarColor",
DROP COLUMN "testimonialsVerifiedBadgeColor",
DROP COLUMN "warningColor",
DROP COLUMN "welcomeBadgeBackground",
DROP COLUMN "welcomeBadgeText",
DROP COLUMN "welcomeFeatureIcon1Color",
DROP COLUMN "welcomeFeatureIcon2Color",
DROP COLUMN "welcomeFeatureIcon3Color";
