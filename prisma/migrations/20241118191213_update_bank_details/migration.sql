/*
  Warnings:

  - You are about to alter the column `accountNumber` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "accountNumber" SET DATA TYPE VARCHAR(10);
