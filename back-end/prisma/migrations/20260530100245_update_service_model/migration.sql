/*
  Warnings:

  - You are about to drop the column `imageLabel` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `pricePackage` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `priceUnit` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `ServicePackage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageURL` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServicePackage" DROP CONSTRAINT "ServicePackage_serviceId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "imageLabel",
DROP COLUMN "pricePackage",
DROP COLUMN "priceUnit",
ADD COLUMN     "imageURL" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ServicePackage";
