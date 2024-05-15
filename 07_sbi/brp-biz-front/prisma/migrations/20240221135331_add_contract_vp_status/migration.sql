/*
  Warnings:

  - Added the required column `partyAVpStatus` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partyBVpStatus` to the `contracts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContractVpStatusType" AS ENUM ('PreRequest', 'Requested', 'Created', 'Verified');

-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "partyAVpStatus" "ContractVpStatusType" NOT NULL,
ADD COLUMN     "partyBVpStatus" "ContractVpStatusType" NOT NULL;
