/*
  Warnings:

  - You are about to drop the column `atividadeSecundarias` on the `Empresa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "atividadeSecundarias",
ADD COLUMN     "atividadeSecundaria" TEXT[];
