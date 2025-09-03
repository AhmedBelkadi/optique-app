-- AlterTable
ALTER TABLE "faq_page_settings" ADD COLUMN     "allQuestionsDescription" TEXT NOT NULL DEFAULT 'Browse through all our frequently asked questions',
ADD COLUMN     "allQuestionsTitle" TEXT NOT NULL DEFAULT 'All Questions',
ADD COLUMN     "browseByTopicDescription" TEXT NOT NULL DEFAULT 'Find answers organized by category',
ADD COLUMN     "browseByTopicTitle" TEXT NOT NULL DEFAULT 'Browse by Topic',
ADD COLUMN     "defaultTheme" TEXT NOT NULL DEFAULT 'auto',
ADD COLUMN     "maxFAQsPerTheme" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "pageSubtitle" TEXT NOT NULL DEFAULT 'Find answers to common questions about our services',
ADD COLUMN     "pageTitle" TEXT NOT NULL DEFAULT 'Frequently Asked Questions',
ADD COLUMN     "showAllQuestionsSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showGroupedTopicsSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showQuestionCounts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showThemeColors" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showThemeIcons" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "useCustomThemes" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "stickyCTAText" SET DEFAULT 'Book Your Appointment';

-- CreateTable
CREATE TABLE "faq_theme_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_theme_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "faq_theme_categories_order_idx" ON "faq_theme_categories"("order");

-- CreateIndex
CREATE INDEX "faq_theme_categories_isActive_idx" ON "faq_theme_categories"("isActive");
