/*
  Warnings:

  - You are about to drop the column `deliveryAddress` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryName` on the `orders` table. All the data in the column will be lost.
  - Added the required column `number` to the `lots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingForId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lots" ADD COLUMN     "number" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "deliveryAddress",
DROP COLUMN "deliveryName",
ADD COLUMN     "shippingForId" INTEGER NOT NULL,
ALTER COLUMN "quality" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "number" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shippingForId_fkey" FOREIGN KEY ("shippingForId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
