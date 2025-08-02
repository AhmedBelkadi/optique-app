-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "reference" DROP NOT NULL;
