-- AlterTable
ALTER TABLE "admin_details" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "admin_notifications" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "company_settings" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "complaints" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "customer_details" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "customer_notifications" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "installation_requests" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "transaction_reports" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
