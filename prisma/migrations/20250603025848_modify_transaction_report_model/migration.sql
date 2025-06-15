/*
  Warnings:

  - You are about to drop the column `end_period` on the `transaction_reports` table. All the data in the column will be lost.
  - You are about to drop the column `report_type` on the `transaction_reports` table. All the data in the column will be lost.
  - You are about to drop the column `start_period` on the `transaction_reports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[month,year]` on the table `transaction_reports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `month` to the `transaction_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `transaction_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_reports" DROP COLUMN "end_period",
DROP COLUMN "report_type",
DROP COLUMN "start_period",
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_reports_month_year_key" ON "transaction_reports"("month", "year");
