/*
  Warnings:

  - A unique constraint covering the columns `[username,is_active]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "unique_active_username" ON "users"("username", "is_active");
