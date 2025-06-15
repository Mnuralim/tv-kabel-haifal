/*
  Warnings:

  - The values [OVERDUE] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `penalty` on the `bills` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PAID', 'IN_REVIEW', 'UNPAID', 'REJECTED');
ALTER TABLE "bills" ALTER COLUMN "payment_status" DROP DEFAULT;
ALTER TABLE "bills" ALTER COLUMN "payment_status" TYPE "PaymentStatus_new" USING ("payment_status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "bills" ALTER COLUMN "payment_status" SET DEFAULT 'UNPAID';
COMMIT;

-- AlterTable
ALTER TABLE "bills" DROP COLUMN "penalty";
