-- CreateTable
CREATE TABLE "trusted_list_partners" (
    "id" SERIAL NOT NULL,
    "obtainedDate" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "publicMultibaseIdentifier" TEXT NOT NULL,
    "publicMultibaseKey" TEXT NOT NULL,
    "businessUnitId" INTEGER NOT NULL,

    CONSTRAINT "trusted_list_partners_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trusted_list_partners" ADD CONSTRAINT "trusted_list_partners_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
