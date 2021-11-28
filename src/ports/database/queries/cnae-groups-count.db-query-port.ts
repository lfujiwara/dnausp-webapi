import { PrismaClient } from '@prisma/client';
import { Injectable, Optional } from '@nestjs/common';
import {
  CnaeGroupsCountQuery,
  CnaeGroupsCountQueryInput,
  CnaeGroupsCountQueryOutput,
} from '../../../app/queries/cnae-groups-count.query';

@Injectable()
export class CnaeGroupsCountDbQueryPort extends CnaeGroupsCountQuery {
  constructor(@Optional() readonly client: PrismaClient = new PrismaClient()) {
    super();
  }

  async execute(
    input: CnaeGroupsCountQueryInput = {},
  ): Promise<CnaeGroupsCountQueryOutput> {
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
