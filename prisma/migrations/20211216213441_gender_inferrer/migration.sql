-- CreateTable
CREATE TABLE "GenderInferrer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isMale" BOOLEAN NOT NULL,

    CONSTRAINT "GenderInferrer_pkey" PRIMARY KEY ("id")
);
