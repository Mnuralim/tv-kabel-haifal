/*
  Warnings:

  - You are about to drop the column `verification_status` on the `payments` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'IN_REVIEW';
ALTER TYPE "PaymentStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "verification_status";

-- DropEnum
DROP TYPE "VerificationStatus";
