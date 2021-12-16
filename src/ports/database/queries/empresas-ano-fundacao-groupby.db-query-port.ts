import { Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaClient } from './prisma';

export type EmpresasAnoFundacaoGroupbyQueryOutput = {
  ano: number;
  count: number;
}[];

export class EmpresasAnoFundacaoGroupbyQuery {
  constructor(@Optional() readonly client: PrismaClient = prismaClient) {}

  execute(): Promise<EmpresasAnoFundacaoGroupbyQueryOutput> {
    return this.client.empresa
      .groupBy({
        by: ['anoFundacao'],
        _count: {
          anoFundacao: true,
        },
      })
      .then((args) =>
        args
          .map((a) => ({
            ano: a.anoFundacao,
            count: a._count.anoFundacao,
          }))
          .sort((a, b) => a.ano - b.ano),
      );
  }
}
