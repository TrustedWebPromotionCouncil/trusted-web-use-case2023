/*
  Warnings:

  - You are about to drop the column `facilityId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `certificates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facilities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `businessUnitId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('S', 'A', 'B', 'C');

-- CreateEnum
CREATE TYPE "ShippingStatusType" AS ENUM ('Before', 'Prepare', 'Shipped');

-- DropForeignKey
ALTER TABLE "certificates" DROP CONSTRAINT "certificates_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "facilities" DROP CONSTRAINT "facilities_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_facilityId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "facilityId",
ADD COLUMN     "businessUnitId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "certificates";

-- DropTable
DROP TABLE "facilities";

-- DropTable
DROP TABLE "organizations";

-- DropEnum
DROP TYPE "CertificateType";

-- CreateTable
CREATE TABLE "legal_entities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "domainName" TEXT,
    "color" TEXT NOT NULL,

    CONSTRAINT "legal_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "did" TEXT,
    "publicKey" TEXT,
    "privateKey" TEXT,
    "legalEntityId" INTEGER NOT NULL,

    CONSTRAINT "business_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "businessUnitId" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lots" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "productId" INTEGER NOT NULL,
    "vcForProductId" INTEGER,

    CONSTRAINT "lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "deliveryName" TEXT,
    "deliveryAddress" TEXT,
    "shippingDate" TIMESTAMP(3),
    "quality" "Rank" NOT NULL,
    "status" "ShippingStatusType" NOT NULL,
    "lotId" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vcs_for_business_unit" (
    "id" SERIAL NOT NULL,
    "authenticationLevel" INTEGER NOT NULL,
    "issuerName" TEXT,
    "uuid" TEXT,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "original" JSONB NOT NULL,
    "businessUnitId" INTEGER NOT NULL,

    CONSTRAINT "vcs_for_business_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vcs_for_product" (
    "id" SERIAL NOT NULL,
    "issuerName" TEXT,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "original" JSONB NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "vcs_for_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vps" (
    "id" SERIAL NOT NULL,
    "original" JSONB NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "vps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vps_orderId_key" ON "vps"("orderId");

-- AddForeignKey
ALTER TABLE "business_units" ADD CONSTRAINT "business_units_legalEntityId_fkey" FOREIGN KEY ("legalEntityId") REFERENCES "legal_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lots" ADD CONSTRAINT "lots_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lots" ADD CONSTRAINT "lots_vcForProductId_fkey" FOREIGN KEY ("vcForProductId") REFERENCES "vcs_for_product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vcs_for_business_unit" ADD CONSTRAINT "vcs_for_business_unit_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vcs_for_product" ADD CONSTRAINT "vcs_for_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vps" ADD CONSTRAINT "vps_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
