-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Scope" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
