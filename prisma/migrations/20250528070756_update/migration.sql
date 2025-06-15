-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_admin_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;
