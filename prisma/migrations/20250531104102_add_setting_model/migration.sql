/*
  Warnings:

  - You are about to drop the column `setting_key` on the `company_settings` table. All the data in the column will be lost.
  - You are about to drop the column `setting_value` on the `company_settings` table. All the data in the column will be lost.
  - Added the required column `address` to the `company_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `company_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `company_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `company_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `company_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `company_settings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "company_settings_setting_key_key";

-- AlterTable
ALTER TABLE "company_settings" DROP COLUMN "setting_key",
DROP COLUMN "setting_value",
ADD COLUMN     "about_us" TEXT,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "monthly_rate" DOUBLE PRECISION NOT NULL DEFAULT 100000,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;
