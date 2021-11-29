-- CreateTable
CREATE TABLE "Faturamento" (
    "empresaId" UUID NOT NULL,
    "anoFiscal" INTEGER NOT NULL,
    "valor" BIGINT NOT NULL,

    CONSTRAINT "Faturamento_pkey" PRIMARY KEY ("empresaId","anoFiscal")
);

-- AddForeignKey
ALTER TABLE "Faturamento" ADD CONSTRAINT "Faturamento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
