-- CreateTable
CREATE TABLE "home_hero" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "cta1" TEXT NOT NULL,
    "cta1Link" TEXT NOT NULL,
    "cta2" TEXT NOT NULL,
    "cta2Link" TEXT NOT NULL,
    "backgroundImage" TEXT,
    "showBackgroundImage" BOOLEAN NOT NULL DEFAULT true,
    "overlayOpacity" INTEGER NOT NULL DEFAULT 40,
    "textColor" TEXT NOT NULL DEFAULT 'white',
    "cta1Variant" TEXT NOT NULL DEFAULT 'default',
    "cta2Variant" TEXT NOT NULL DEFAULT 'outline',
    "cta1Size" TEXT NOT NULL DEFAULT 'lg',
    "cta2Size" TEXT NOT NULL DEFAULT 'lg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_welcome" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "showDivider" BOOLEAN NOT NULL DEFAULT true,
    "dividerColor" TEXT NOT NULL DEFAULT 'primary',
    "textAlignment" TEXT NOT NULL DEFAULT 'center',
    "backgroundColor" TEXT NOT NULL DEFAULT 'transparent',
    "textColor" TEXT NOT NULL DEFAULT 'foreground',
    "padding" TEXT NOT NULL DEFAULT 'lg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_welcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_floating_cta" (
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

    CONSTRAINT "home_floating_cta_pkey" PRIMARY KEY ("id")
);
