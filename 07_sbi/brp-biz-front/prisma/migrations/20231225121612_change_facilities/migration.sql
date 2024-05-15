/*
  Warnings:

  - Added the required column `domainName` to the `business_units` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "business_units" ADD COLUMN     "domainName" TEXT NOT NULL;
