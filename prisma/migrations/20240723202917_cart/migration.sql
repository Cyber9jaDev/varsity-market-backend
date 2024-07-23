/*
  Warnings:

  - You are about to drop the column `cartUserId` on the `Cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[buyerId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyerId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_cartUserId_fkey";

-- DropIndex
DROP INDEX "Cart_cartUserId_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "cartUserId",
ADD COLUMN     "buyerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_buyerId_key" ON "Cart"("buyerId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
