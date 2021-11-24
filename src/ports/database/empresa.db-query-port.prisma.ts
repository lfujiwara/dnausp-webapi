import { PrismaClient } from '@prisma/client';
import { Injectable, Optional } from '@nestjs/common';

export type CnaeGroupsCountInput = {
  anoMin?: number;
  anoMax?: number;
};

export type CnaeGroupsCountOutput = {
  cnae: string;
  count: number;
}[];

@Injectable()
export class EmpresaDbQueryPortPrisma {
  constructor(@Optional() readonly client: PrismaClient = new PrismaClient()) {}

  async execute(
    input: CnaeGroupsCountInput = {},
  ): Promise<CnaeGroupsCountOutput> {
    const queryRes = await this.client.empresa.groupBy({
      by: ['atividadePrincipal'],
      _count: {
        atividadePrincipal: true,
      },
      where: {
        anoFundacao: {
          gte: input.anoMin,
          lte: input.anoMax,
        },
        atividadePrincipal: {
          not: null,
        },
      },
    });

    return queryRes.map(({ atividadePrincipal, _count }) => ({
      cnae: atividadePrincipal,
      count: _count.atividadePrincipal,
    }));
  }
}
