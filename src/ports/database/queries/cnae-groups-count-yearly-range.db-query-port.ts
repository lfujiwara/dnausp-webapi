import {
  CnaeGroupsCountQueryInput,
  CnaeGroupsCountQueryOutput,
  CnaeGroupsCountYearlyRangeQuery,
  CnaeGroupsCountYearlyRangeQueryOutput,
} from '@dnausp/core';
import { Injectable, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaClient } from './prisma';

@Injectable()
export class CnaeGroupsCountYearlyRangeDbQueryPort extends CnaeGroupsCountYearlyRangeQuery {
  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  async execute(
    input: CnaeGroupsCountQueryInput,
  ): Promise<CnaeGroupsCountYearlyRangeQueryOutput> {
    const {
      _min: { anoFundacao: anoMinAgg },
      _max: { anoFundacao: anoMaxAgg },
    } = await this.client.empresa.aggregate({
      _min: {
        anoFundacao: true,
      },
      _max: {
        anoFundacao: true,
      },
    });

    const anoMin = input.anoMin || anoMinAgg;
    const anoMax = input.anoMax || anoMaxAgg;

    if (isNaN(anoMin) || isNaN(anoMax)) return [];

    const queryRes = await this.client.empresa.groupBy({
      by: ['atividadePrincipal', 'anoFundacao'],
      _count: {
        atividadePrincipal: true,
      },
      where: {
        anoFundacao: {
          gte: anoMin,
          lte: anoMax,
        },
        atividadePrincipal: {
          not: null,
        },
      },
    });

    const data: CnaeGroupsCountYearlyRangeQueryOutput = Array(
      anoMax - anoMin + 1,
    )
      .fill(0)
      .map((_, i) => ({
        year: anoMin + i,
        value: [] as CnaeGroupsCountQueryOutput,
      }));
    const getIndex = (ano: number) => ano - anoMin;

    queryRes.forEach(({ anoFundacao, atividadePrincipal, _count }) => {
      data[getIndex(anoFundacao)].value.push({
        cnae: atividadePrincipal,
        count: _count.atividadePrincipal,
      });
    });

    return data;
  }
}
