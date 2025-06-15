/*
  Warnings:

  - You are about to drop the column `related_id` on the `admin_notifications` table. All the data in the column will be lost.
  - You are about to drop the column `related_id` on the `customer_notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admin_notifications" DROP COLUMN "related_id",
ADD COLUMN     "redirect_to" TEXT;

-- AlterTable
ALTER TABLE "customer_notifications" DROP COLUMN "related_id",
ADD COLUMN     "redirect_to" TEXT;
