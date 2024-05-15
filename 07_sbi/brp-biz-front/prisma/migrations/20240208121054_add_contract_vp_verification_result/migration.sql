-- AlterTable
ALTER TABLE "contract_vps" ADD COLUMN     "challengeVcContent" TEXT,
ADD COLUMN     "challengeVcSignature" TEXT,
ADD COLUMN     "vcContent" TEXT,
ADD COLUMN     "vcIssuerPublicKey" TEXT,
ADD COLUMN     "vcIssuerSignature" TEXT,
ADD COLUMN     "vcIssuerSignedContent" TEXT,
ADD COLUMN     "vcIssuerUuid" TEXT,
ADD COLUMN     "vcIssuerVcSignature" TEXT,
ADD COLUMN     "vcIssuerVpSignature" TEXT,
ADD COLUMN     "vcSignature" TEXT,
ADD COLUMN     "vcSignedVcContent" TEXT,
ADD COLUMN     "vcSignedVpContent" TEXT;

-- CreateTable
CREATE TABLE "contract_vp_verification_results" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hasValidChallengeVc" BOOLEAN NOT NULL,
    "hasOpponentChallenge" BOOLEAN NOT NULL,
    "hasValidVp" BOOLEAN NOT NULL,
    "hasValidVcForBusinessUnit" BOOLEAN NOT NULL,
    "hasValidIssuerVp" BOOLEAN NOT NULL,
    "hasValidIssuerVc" BOOLEAN NOT NULL,
    "hasValidBusinessUnitCredentialStatus" BOOLEAN NOT NULL,
    "hasValidIssuerCredentialStatus" BOOLEAN NOT NULL,
    "contractVpId" INTEGER NOT NULL,

    CONSTRAINT "contract_vp_verification_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contract_vp_verification_results_contractVpId_key" ON "contract_vp_verification_results"("contractVpId");

-- AddForeignKey
ALTER TABLE "contract_vp_verification_results" ADD CONSTRAINT "contract_vp_verification_results_contractVpId_fkey" FOREIGN KEY ("contractVpId") REFERENCES "contract_vps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
