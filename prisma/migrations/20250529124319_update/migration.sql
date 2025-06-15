-- AlterTable
ALTER TABLE "customer_details" ALTER COLUMN "registration_date" DROP NOT NULL,
ALTER COLUMN "subscription_start_date" DROP NOT NULL,
ALTER COLUMN "monthly_rate" DROP NOT NULL;
