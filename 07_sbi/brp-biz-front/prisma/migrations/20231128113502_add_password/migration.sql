/*
  Warnings:

  - Added the required column `color` to the `organizations` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `organizations` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#ffffff',
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL DEFAULT '$2b$10$4Fx1DXRStqrrF0L8WzKhZ.0kVjLGouTuR4U59dpiSR6J32Gm/HkNW',
ALTER COLUMN "name" SET NOT NULL;
