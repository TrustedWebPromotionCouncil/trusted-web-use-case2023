/*
  Warnings:

  - You are about to drop the column `credentialString` on the `vcs_for_business_unit` table. All the data in the column will be lost.
  - Added the required column `signature` to the `vcs_for_business_unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vcContent` to the `vcs_for_business_unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vcs_for_business_unit" DROP COLUMN "credentialString",
ADD COLUMN     "issuerPublicKey" TEXT,
ADD COLUMN     "issuerSignature" TEXT,
ADD COLUMN     "issuerSignedContent" TEXT,
ADD COLUMN     "issuerUuid" TEXT,
ADD COLUMN     "issuerVcSignature" TEXT,
ADD COLUMN     "issuerVpSignature" TEXT,
ADD COLUMN     "signature" TEXT NOT NULL,
ADD COLUMN     "signedVcContent" TEXT,
ADD COLUMN     "signedVpContent" TEXT,
ADD COLUMN     "vcContent" TEXT NOT NULL,
ALTER COLUMN "issuerName" DROP NOT NULL,
ALTER COLUMN "uuid" DROP NOT NULL;
