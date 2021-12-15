-- DropForeignKey
ALTER TABLE "Faturamento" DROP CONSTRAINT "Faturamento_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Incubacao" DROP CONSTRAINT "Incubacao_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Investimento" DROP CONSTRAINT "Investimento_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "QuadroDeColaboradores" DROP CONSTRAINT "QuadroDeColaboradores_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Socio" DROP CONSTRAINT "Socio_empresaId_fkey";

-- AddForeignKey
ALTER TABLE "Faturamento" ADD CONSTRAINT "Faturamento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuadroDeColaboradores" ADD CONSTRAINT "QuadroDeColaboradores_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investimento" ADD CONSTRAINT "Investimento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incubacao" ADD CONSTRAINT "Incubacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
