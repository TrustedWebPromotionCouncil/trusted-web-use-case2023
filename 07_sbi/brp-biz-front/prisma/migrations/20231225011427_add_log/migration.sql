/*
  Warnings:

  - Added the required column `numberOfIssuedVc` to the `business_units` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfIssuedVp` to the `business_units` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefix` to the `business_units` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_units" ADD COLUMN     "numberOfIssuedVc" INTEGER NOT NULL,
ADD COLUMN     "numberOfIssuedVp" INTEGER NOT NULL,
ADD COLUMN     "prefix" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "requestUrl" TEXT NOT NULL,
    "requestMethod" TEXT NOT NULL,
    "requestBody" JSONB NOT NULL,
    "status" TEXT,
    "responseBody" JSONB,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_results" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hasValidBusinessUnitSignature" BOOLEAN NOT NULL,
    "hasValidVcForBusinessUnit" BOOLEAN NOT NULL,
    "hasValidIssuerSignature" BOOLEAN NOT NULL,
    "hasValidIssuerVc" BOOLEAN NOT NULL,
    "hasValidBusinessUnitCredentialStatus" BOOLEAN NOT NULL,
    "hasValidIssuerCredentialStatus" BOOLEAN NOT NULL,
    "vpId" INTEGER NOT NULL,

    CONSTRAINT "verification_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_results_vpId_key" ON "verification_results"("vpId");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_results" ADD CONSTRAINT "verification_results_vpId_fkey" FOREIGN KEY ("vpId") REFERENCES "vps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
