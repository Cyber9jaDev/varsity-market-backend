/*
  Warnings:

  - Added the required column `updatedAt` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `location` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Location" AS ENUM ('UI', 'FUNAAB', 'OAU', 'ABU', 'BUK', 'LASPOTECH', 'POLYIBADAN', 'OSCOTECH', 'IREPOLY', 'FUTA', 'ACU');

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "location",
ADD COLUMN     "location" "Location" NOT NULL;
