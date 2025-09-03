-- AlterTable
ALTER TABLE "public"."about_benefits" ALTER COLUMN "highlight" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."about_cta" ALTER COLUMN "primaryButtonLink" DROP DEFAULT,
ALTER COLUMN "primaryButtonText" DROP DEFAULT,
ALTER COLUMN "secondaryButtonLink" DROP DEFAULT,
ALTER COLUMN "secondaryButtonText" DROP DEFAULT;
