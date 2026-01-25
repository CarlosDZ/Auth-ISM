/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,name]` on the table `Scope` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `Scope` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scope" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Scope_tenantId_name_key" ON "Scope"("tenantId", "name");

-- AddForeignKey
ALTER TABLE "Scope" ADD CONSTRAINT "Scope_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
