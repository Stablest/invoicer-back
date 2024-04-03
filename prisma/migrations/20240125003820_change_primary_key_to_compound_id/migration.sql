/*
  Warnings:

  - The primary key for the `clients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP CONSTRAINT "clients_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("email", "userId");
