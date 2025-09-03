-- AlterTable
ALTER TABLE "public"."testimonials" ADD COLUMN     "externalData" JSONB,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "externalUrl" TEXT,
ADD COLUMN     "isSynced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSynced" TIMESTAMP(3),
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'internal',
ADD COLUMN     "syncStatus" TEXT NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "testimonials_source_idx" ON "public"."testimonials"("source");

-- CreateIndex
CREATE INDEX "testimonials_isVerified_idx" ON "public"."testimonials"("isVerified");

-- CreateIndex
CREATE INDEX "testimonials_syncStatus_idx" ON "public"."testimonials"("syncStatus");

-- CreateIndex
CREATE INDEX "testimonials_externalId_idx" ON "public"."testimonials"("externalId");
