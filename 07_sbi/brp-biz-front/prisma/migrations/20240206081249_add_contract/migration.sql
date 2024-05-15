-- CreateEnum
CREATE TYPE "ContractStatusType" AS ENUM ('InProgress', 'Finalized');

-- CreateEnum
CREATE TYPE "ContractDocumentStatusType" AS ENUM ('PreReview', 'Reviewed');

-- CreateTable
CREATE TABLE "contracts" (
    "id" SERIAL NOT NULL,
    "contractDate" TIMESTAMP(3) NOT NULL,
    "contractDocumentStatus" "ContractDocumentStatusType" NOT NULL,
    "partyAId" INTEGER NOT NULL,
    "partyAChallenge" TEXT,
    "partyBId" INTEGER NOT NULL,
    "partyBChallenge" TEXT,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_vps" (
    "id" SERIAL NOT NULL,
    "issuerName" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "challengeVcValidFrom" TEXT,
    "challengeVcValidUntil" TEXT,
    "challengeVcIssuerId" TEXT,
    "challengeVcIssuerName" TEXT,
    "challengeVcHolderId" TEXT,
    "challengeVcHolderName" TEXT,
    "challenge" TEXT NOT NULL,
    "vcValidFrom" TEXT,
    "vcValidUntil" TEXT,
    "vcUuid" TEXT,
    "vcAuthId" TEXT,
    "vcAuthName" TEXT,
    "vcAuthCertifierName" TEXT,
    "vcBusinessUnitId" TEXT,
    "vcBusinessUnitName" TEXT,
    "vcBusinessUnitCountry" TEXT,
    "vcBusinessUnitAddress" TEXT,
    "vcLegalEntityIdentifier" TEXT,
    "vcLegalEntityName" TEXT,
    "vcLegalEntityLocation" TEXT,
    "original" JSONB NOT NULL,
    "businessUnitId" INTEGER NOT NULL,
    "contractId" INTEGER NOT NULL,

    CONSTRAINT "contract_vps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_vcs" (
    "id" SERIAL NOT NULL,
    "challenge" TEXT NOT NULL,
    "issuerName" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "original" JSONB NOT NULL,
    "businessUnitId" INTEGER NOT NULL,
    "contractId" INTEGER NOT NULL,

    CONSTRAINT "challenge_vcs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_partyAId_fkey" FOREIGN KEY ("partyAId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_partyBId_fkey" FOREIGN KEY ("partyBId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_vps" ADD CONSTRAINT "contract_vps_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_vps" ADD CONSTRAINT "contract_vps_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_vcs" ADD CONSTRAINT "challenge_vcs_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_vcs" ADD CONSTRAINT "challenge_vcs_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
