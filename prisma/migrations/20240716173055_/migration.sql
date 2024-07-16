-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productInCartId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "productInCartId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productInCartId_fkey" FOREIGN KEY ("productInCartId") REFERENCES "Cart"("cartId") ON DELETE SET NULL ON UPDATE CASCADE;
