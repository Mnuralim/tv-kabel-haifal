/*
  Warnings:

  - The values [SYSTEM_ALERT,REPORT_GENERATED] on the enum `AdminNotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminNotificationType_new" AS ENUM ('NEW_PAYMENT', 'NEW_COMPLAINT', 'INSTALLATION_REQUEST', 'USER_ACTIVATION_REQUEST');
ALTER TABLE "admin_notifications" ALTER COLUMN "type" TYPE "AdminNotificationType_new" USING ("type"::text::"AdminNotificationType_new");
ALTER TYPE "AdminNotificationType" RENAME TO "AdminNotificationType_old";
ALTER TYPE "AdminNotificationType_new" RENAME TO "AdminNotificationType";
DROP TYPE "AdminNotificationType_old";
COMMIT;
