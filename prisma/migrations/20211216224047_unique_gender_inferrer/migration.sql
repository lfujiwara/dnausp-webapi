/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `GenderInferrer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GenderInferrer_name_key" ON "GenderInferrer"("name");
