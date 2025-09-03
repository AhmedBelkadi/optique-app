-- CreateTable
CREATE TABLE "about_floating_cta" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,
    "buttonIcon" TEXT NOT NULL,
    "buttonVariant" TEXT NOT NULL DEFAULT 'default',
    "buttonSize" TEXT NOT NULL DEFAULT 'lg',
    "position" TEXT NOT NULL DEFAULT 'bottom-right',
    "showOnScroll" BOOLEAN NOT NULL DEFAULT true,
    "scrollThreshold" INTEGER NOT NULL DEFAULT 300,
    "customColors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_floating_cta_pkey" PRIMARY KEY ("id")
);
