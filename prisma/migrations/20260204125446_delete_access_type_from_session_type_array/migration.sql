/*
  Warnings:

  - The values [ACCESS] on the enum `SessionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SessionType_new" AS ENUM ('REFRESH', 'API_KEY', 'MAGIC_LINK', 'PASSWORD_RESET', 'EMAIL_VERIFY');
ALTER TABLE "Session" ALTER COLUMN "type" TYPE "SessionType_new" USING ("type"::text::"SessionType_new");
ALTER TYPE "SessionType" RENAME TO "SessionType_old";
ALTER TYPE "SessionType_new" RENAME TO "SessionType";
DROP TYPE "public"."SessionType_old";
COMMIT;
