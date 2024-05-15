/*
  Warnings:

  - Added the required column `isPrivateVc` to the `vcs_for_business_unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vcs_for_business_unit" ADD COLUMN     "isPrivateVc" BOOLEAN NOT NULL;
