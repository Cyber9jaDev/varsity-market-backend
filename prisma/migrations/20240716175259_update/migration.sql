/*
  Warnings:

  - Changed the type of `condition` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('ALL', 'PET', 'CAR');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('NEW', 'USED', 'REFURBISHED');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "condition",
ADD COLUMN     "condition" "ConditionType" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "CategoryType" NOT NULL;

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "Condition";
