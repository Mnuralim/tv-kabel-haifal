-- CreateEnum
CREATE TYPE "InstallationStatus" AS ENUM ('PENDING', 'APPROVED', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "installation_requests" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "admin_id" TEXT,
    "installation_address" TEXT NOT NULL,
    "notes" TEXT,
    "status" "InstallationStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_date" DATE,
    "completion_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "installation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "installation_requests_customer_id_key" ON "installation_requests"("customer_id");

-- AddForeignKey
ALTER TABLE "installation_requests" ADD CONSTRAINT "installation_requests_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "installation_requests" ADD CONSTRAINT "installation_requests_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;
