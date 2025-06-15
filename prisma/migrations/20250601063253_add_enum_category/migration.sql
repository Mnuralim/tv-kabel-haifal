/*
  Warnings:

  - Changed the type of `category` on the `complaints` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ComplaintCategory" AS ENUM ('VIDEO_ISSUE', 'AUDIO_ISSUE', 'CHANNEL_ISSUE', 'BILLING_ISSUE', 'INSTALLATION', 'SERVICE_STAFF', 'OTHERS');

-- AlterTable
ALTER TABLE "complaints" DROP COLUMN "category",
ADD COLUMN     "category" "ComplaintCategory" NOT NULL;
