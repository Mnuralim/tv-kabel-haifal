-- AlterTable
ALTER TABLE "admin_notifications" ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read_at" TIMESTAMP(3);
