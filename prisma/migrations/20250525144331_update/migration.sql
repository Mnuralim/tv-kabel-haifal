/*
  Warnings:

  - You are about to alter the column `amount` on the `bills` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `penalty` on the `bills` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `monthly_rate` on the `customer_details` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `total_revenue` on the `transaction_reports` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "bills" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "penalty" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "customer_details" ALTER COLUMN "monthly_rate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "transaction_reports" ALTER COLUMN "total_revenue" SET DATA TYPE DOUBLE PRECISION;
