/*
  Warnings:

  - You are about to drop the column `atividadesSecundarias` on the `Empresa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "atividadesSecundarias",
ADD COLUMN     "atividadeSecundarias" TEXT[];

-- CreateTable
CREATE TABLE "QuadroDeColaboradores" (
    "empresaId" UUID NOT NULL,
    "anoFiscal" INTEGER NOT NULL,
    "valor" BIGINT NOT NULL,

    CONSTRAINT "QuadroDeColaboradores_pkey" PRIMARY KEY ("empresaId","anoFiscal")
);

-- CreateTable
CREATE TABLE "Investimento" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "origem" TEXT NOT NULL,
    "anoFiscal" INTEGER NOT NULL,
    "valor" BIGINT NOT NULL,

    CONSTRAINT "Investimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incubacao" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "incubadora" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Incubacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socio" (
    "id" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "tipoVinculo" TEXT,
    "NUSP" TEXT,
    "instituto" TEXT,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuadroDeColaboradores" ADD CONSTRAINT "QuadroDeColaboradores_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investimento" ADD CONSTRAINT "Investimento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incubacao" ADD CONSTRAINT "Incubacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
