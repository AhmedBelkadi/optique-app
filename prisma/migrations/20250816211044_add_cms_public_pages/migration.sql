/*
  Warnings:

  - You are about to drop the column `allQuestionsDescription` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `allQuestionsTitle` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `browseByTopicDescription` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `browseByTopicTitle` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `defaultTheme` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `maxFAQsPerTheme` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `pageSubtitle` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `pageTitle` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `showAllQuestionsSection` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `showGroupedTopicsSection` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `showQuestionCounts` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `showThemeColors` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `showThemeIcons` on the `faq_page_settings` table. All the data in the column will be lost.
  - You are about to drop the column `useCustomThemes` on the `faq_page_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "faq_page_settings" DROP COLUMN "allQuestionsDescription",
DROP COLUMN "allQuestionsTitle",
DROP COLUMN "browseByTopicDescription",
DROP COLUMN "browseByTopicTitle",
DROP COLUMN "defaultTheme",
DROP COLUMN "maxFAQsPerTheme",
DROP COLUMN "pageSubtitle",
DROP COLUMN "pageTitle",
DROP COLUMN "showAllQuestionsSection",
DROP COLUMN "showGroupedTopicsSection",
DROP COLUMN "showQuestionCounts",
DROP COLUMN "showThemeColors",
DROP COLUMN "showThemeIcons",
DROP COLUMN "useCustomThemes",
ALTER COLUMN "stickyCTAText" SET DEFAULT 'Book Vision Test';

-- CreateTable
CREATE TABLE "products_page_hero" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "title" TEXT NOT NULL DEFAULT 'Our Product Catalog',
    "subtitle" TEXT NOT NULL DEFAULT 'Discover our premium selection of eyewear, frames, and optical accessories. Find the perfect style that matches your personality and vision needs.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_page_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_page_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "pageTitle" TEXT NOT NULL DEFAULT 'Products - Optique',
    "pageSubtitle" TEXT NOT NULL DEFAULT 'Browse our complete collection of eyewear and optical products',
    "metaTitle" TEXT NOT NULL DEFAULT 'Products - Optique',
    "metaDescription" TEXT NOT NULL DEFAULT 'Browse our premium collection of eyewear, frames, and optical accessories',
    "showSearch" BOOLEAN NOT NULL DEFAULT true,
    "showCategoryFilter" BOOLEAN NOT NULL DEFAULT true,
    "showPriceFilter" BOOLEAN NOT NULL DEFAULT true,
    "showSorting" BOOLEAN NOT NULL DEFAULT true,
    "itemsPerPage" INTEGER NOT NULL DEFAULT 12,
    "maxVisiblePages" INTEGER NOT NULL DEFAULT 5,
    "heroBackground" TEXT NOT NULL DEFAULT 'gradient-to-br from-primary via-primary/95 to-primary/90',
    "textColor" TEXT NOT NULL DEFAULT 'primary-foreground',
    "ctaTitle" TEXT NOT NULL DEFAULT 'Need Help Choosing?',
    "ctaSubtitle" TEXT NOT NULL DEFAULT 'Our optical specialists are here to help you find the perfect frames. Book a consultation today.',
    "ctaButtonText" TEXT NOT NULL DEFAULT 'Book Consultation',
    "ctaButtonLink" TEXT NOT NULL DEFAULT '/appointment',
    "ctaSecondaryButtonText" TEXT NOT NULL DEFAULT 'View All Products',
    "ctaSecondaryButtonLink" TEXT NOT NULL DEFAULT '/products',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials_page_hero" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "title" TEXT NOT NULL DEFAULT 'What Our Patients Say',
    "subtitle" TEXT NOT NULL DEFAULT 'Real experiences from our valued patients who trust us with their vision care. Discover why thousands choose Optique for their eye health needs.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_page_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials_page_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "pageTitle" TEXT NOT NULL DEFAULT 'Testimonials - Optique',
    "pageSubtitle" TEXT NOT NULL DEFAULT 'Read what our patients say about their experience with us',
    "metaTitle" TEXT NOT NULL DEFAULT 'Testimonials - Optique',
    "metaDescription" TEXT NOT NULL DEFAULT 'Read real experiences from our valued patients who trust us with their vision care',
    "showSearch" BOOLEAN NOT NULL DEFAULT true,
    "itemsPerPage" INTEGER NOT NULL DEFAULT 12,
    "maxVisiblePages" INTEGER NOT NULL DEFAULT 5,
    "heroBackground" TEXT NOT NULL DEFAULT 'gradient-to-br from-primary via-primary/95 to-primary/90',
    "textColor" TEXT NOT NULL DEFAULT 'primary-foreground',
    "ctaTitle" TEXT NOT NULL DEFAULT 'Join Our Happy Patients',
    "ctaSubtitle" TEXT NOT NULL DEFAULT 'Experience the Optique difference for yourself. Book your appointment today and become part of our growing family of satisfied patients.',
    "ctaButtonText" TEXT NOT NULL DEFAULT 'Book Appointment',
    "ctaButtonLink" TEXT NOT NULL DEFAULT '/appointment',
    "ctaSecondaryButtonText" TEXT NOT NULL DEFAULT 'Contact Us',
    "ctaSecondaryButtonLink" TEXT NOT NULL DEFAULT '/contact',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_details_page_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "pageTitle" TEXT NOT NULL DEFAULT 'Product Details - Optique',
    "pageSubtitle" TEXT NOT NULL DEFAULT 'Detailed information about our products',
    "metaTitle" TEXT NOT NULL DEFAULT 'Product Details - Optique',
    "metaDescription" TEXT NOT NULL DEFAULT 'Get detailed information about our premium eyewear products',
    "showRelatedProducts" BOOLEAN NOT NULL DEFAULT true,
    "maxRelatedProducts" INTEGER NOT NULL DEFAULT 4,
    "showBreadcrumbs" BOOLEAN NOT NULL DEFAULT true,
    "showProductSpecs" BOOLEAN NOT NULL DEFAULT true,
    "showProductDetails" BOOLEAN NOT NULL DEFAULT true,
    "showCategories" BOOLEAN NOT NULL DEFAULT true,
    "ctaTitle" TEXT NOT NULL DEFAULT 'Need Help Choosing?',
    "ctaSubtitle" TEXT NOT NULL DEFAULT 'Our optical specialists are here to help you find the perfect frames. Book a consultation today.',
    "ctaButtonText" TEXT NOT NULL DEFAULT 'Book Consultation',
    "ctaButtonLink" TEXT NOT NULL DEFAULT '/appointment',
    "ctaSecondaryButtonText" TEXT NOT NULL DEFAULT 'View All Products',
    "ctaSecondaryButtonLink" TEXT NOT NULL DEFAULT '/products',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_details_page_settings_pkey" PRIMARY KEY ("id")
);
