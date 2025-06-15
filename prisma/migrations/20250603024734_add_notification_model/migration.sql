-- CreateEnum
CREATE TYPE "AdminNotificationType" AS ENUM ('NEW_PAYMENT', 'NEW_COMPLAINT', 'INSTALLATION_REQUEST', 'SYSTEM_ALERT', 'REPORT_GENERATED');

-- CreateEnum
CREATE TYPE "CustomerNotificationType" AS ENUM ('BILL_DUE', 'PAYMENT_CONFIRMED', 'COMPLAINT_UPDATE', 'INSTALLATION_SCHEDULED', 'SERVICE_ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "admin_notifications" (
    "id" TEXT NOT NULL,
    "type" "AdminNotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "related_id" TEXT,
    "related_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_notifications" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "type" "CustomerNotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "related_id" TEXT,
    "related_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "customer_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "customer_notifications" ADD CONSTRAINT "customer_notifications_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
