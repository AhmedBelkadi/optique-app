-- CreateTable
CREATE TABLE "public"."external_api_settings" (
    "id" TEXT NOT NULL,
    "googlePlacesApiKey" TEXT,
    "googlePlaceId" TEXT,
    "facebookAccessToken" TEXT,
    "facebookPageId" TEXT,
    "enableGoogleSync" BOOLEAN NOT NULL DEFAULT false,
    "enableFacebookSync" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_api_settings_pkey" PRIMARY KEY ("id")
);
