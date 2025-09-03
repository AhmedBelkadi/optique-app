/*
  Warnings:

  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "settings";

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteName" TEXT,
    "slogan" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "contactEmail" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "openingHours" TEXT,
    "googleMapsApiKey" TEXT,
    "whatsappChatLink" TEXT,
    "googleMapEmbed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "productMetaTitle" TEXT,
    "productMetaDescription" TEXT,
    "categoryMetaTitle" TEXT,
    "categoryMetaDescription" TEXT,
    "ogImage" TEXT,
    "googleAnalyticsId" TEXT,
    "facebookPixelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "accentColor" TEXT,
    "backgroundColor" TEXT,
    "mutedBackgroundColor" TEXT,
    "cardBackgroundColor" TEXT,
    "foregroundColor" TEXT,
    "mutedForegroundColor" TEXT,
    "borderColor" TEXT,
    "popoverBackgroundColor" TEXT,
    "popoverForegroundColor" TEXT,
    "successColor" TEXT,
    "warningColor" TEXT,
    "errorColor" TEXT,
    "infoColor" TEXT,
    "heroBadgeBackground" TEXT,
    "heroBadgeText" TEXT,
    "heroScrollIndicatorColor" TEXT,
    "welcomeBadgeBackground" TEXT,
    "welcomeBadgeText" TEXT,
    "welcomeFeatureIcon1Color" TEXT,
    "welcomeFeatureIcon2Color" TEXT,
    "welcomeFeatureIcon3Color" TEXT,
    "productsNewBadgeColor" TEXT,
    "productsPopularBadgeColor" TEXT,
    "productsCategoryBadgeBackground" TEXT,
    "productsCategoryBadgeText" TEXT,
    "testimonialsBadgeBackground" TEXT,
    "testimonialsBadgeText" TEXT,
    "testimonialsStarColor" TEXT,
    "testimonialsVerifiedBadgeColor" TEXT,
    "floatingCTAGlowColor" TEXT,
    "floatingCTAParticlesColor" TEXT,
    "heroOverlayStartColor" TEXT,
    "heroOverlayMiddleColor" TEXT,
    "heroOverlayEndColor" TEXT,
    "decorativeElement1Color" TEXT,
    "decorativeElement2Color" TEXT,
    "decorativeElement3Color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operational_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operational_settings_pkey" PRIMARY KEY ("id")
);
