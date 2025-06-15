/*
  Warnings:

  - You are about to drop the column `verified_at` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "verified_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "verified_at";
