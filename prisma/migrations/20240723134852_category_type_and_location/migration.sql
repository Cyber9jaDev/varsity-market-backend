/*
  Warnings:

  - The values [ALL] on the enum `CategoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryType_new" AS ENUM ('PET', 'CAR', 'PHONE', 'LAPTOP', 'COMPUTER', 'ACCESSORIES', 'BIKE', 'FURNITURE', 'BOOK', 'FASHION', 'ACCOMMODATION');
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "CategoryType_new" USING ("category"::text::"CategoryType_new");
ALTER TYPE "CategoryType" RENAME TO "CategoryType_old";
ALTER TYPE "CategoryType_new" RENAME TO "CategoryType";
DROP TYPE "CategoryType_old";
COMMIT;
