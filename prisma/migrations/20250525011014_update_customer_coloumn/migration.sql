/*
  Warnings:

  - Added the required column `birth_date` to the `customer_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_place` to the `customer_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family_card_number` to the `customer_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer_details" ADD COLUMN     "birth_date" DATE NOT NULL,
ADD COLUMN     "birth_place" TEXT NOT NULL,
ADD COLUMN     "family_card_number" TEXT NOT NULL;
