/*
  Warnings:

  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cartId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `productInCartId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartUserId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartUserId` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Cart` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productInCartId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
DROP COLUMN "cartId",
ADD COLUMN     "cartUserId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productInCartId";

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productInCartId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_productInCartId_key" ON "CartItem"("productInCartId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_cartUserId_key" ON "Cart"("cartUserId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_cartUserId_fkey" FOREIGN KEY ("cartUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productInCartId_fkey" FOREIGN KEY ("productInCartId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
