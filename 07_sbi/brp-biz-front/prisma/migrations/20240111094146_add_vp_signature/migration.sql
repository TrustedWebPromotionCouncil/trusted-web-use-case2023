/*
  Warnings:

  - Made the column `issuerName` on table `vcs_for_business_unit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `vcs_for_business_unit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `validFrom` on table `vcs_for_business_unit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `validUntil` on table `vcs_for_business_unit` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `signature` to the `vps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vcs_for_business_unit" ADD COLUMN     "credentialString" TEXT,
ALTER COLUMN "issuerName" SET NOT NULL,
ALTER COLUMN "uuid" SET NOT NULL,
ALTER COLUMN "validFrom" SET NOT NULL,
ALTER COLUMN "validUntil" SET NOT NULL;

-- AlterTable
ALTER TABLE "vps" ADD COLUMN     "signature" TEXT NOT NULL;
