-- CreateTable
CREATE TABLE "Empresa" (
    "id" UUID NOT NULL,
    "idEstrangeira" INTEGER,
    "estrangeira" BOOLEAN NOT NULL DEFAULT false,
    "cnpj" TEXT,
    "razaoSocial" TEXT,
    "nomeFantasia" TEXT,
    "anoFundacao" INTEGER NOT NULL,
    "atividadePrincipal" TEXT,
    "atividadesSecundarias" TEXT[],
    "situacao" TEXT,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_idEstrangeira_key" ON "Empresa"("idEstrangeira");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");
