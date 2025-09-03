-- CreateTable
CREATE TABLE "faq_hero" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_contact_cta" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "contactButtonText" TEXT NOT NULL,
    "contactButtonLink" TEXT NOT NULL,
    "appointmentButtonText" TEXT NOT NULL,
    "appointmentButtonLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_contact_cta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_page_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "showStickyCTA" BOOLEAN NOT NULL DEFAULT true,
    "stickyCTAText" TEXT NOT NULL DEFAULT 'Book Vision Test',
    "stickyCTALink" TEXT NOT NULL DEFAULT '/appointment',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_page_settings_pkey" PRIMARY KEY ("id")
);
