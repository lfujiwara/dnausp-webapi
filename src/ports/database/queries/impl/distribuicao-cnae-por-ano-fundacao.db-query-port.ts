import {
  DistribuicaoCnaePorAnoFundacaoQuery,
  DistribuicaoCnaePorAnoFundacaoQueryOutput,
} from '@dnausp/core';
import { Prisma, PrismaClient } from '@prisma/client';
import { Optional } from '@nestjs/common';
import { prismaClient } from '../prisma';
import { QueryResult } from '../util/query-result';

export class DistribuicaoCnaePorAnoFundacaoDbQueryPort extends DistribuicaoCnaePorAnoFundacaoQuery {
  static provider = {
    provide: DistribuicaoCnaePorAnoFundacaoQuery,
    useClass: DistribuicaoCnaePorAnoFundacaoDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  async execute(): Promise<DistribuicaoCnaePorAnoFundacaoQueryOutput> {
    const query = Prisma.sql`
    select "anoFundacao" ano, jsonb_object_agg("cnae", cnt) distribuicao
    from (
      select "anoFundacao", "atividadePrincipal" cnae, count(*) cnt
      from "Empresa" E
        group by "atividadePrincipal", "anoFundacao"
      ) as X
    group by "anoFundacao"
    `;
    const result = await this.client
      .$queryRaw(query)
      .then((res: DistribuicaoCnaePorAnoFundacaoQueryOutput) => {
        res.sort((a, b) => a.ano - b.ano);
        return res;
      });

    return (await QueryResult.build(
      this.client,
      result,
      Prisma.sql`select count(*) count from "Empresa" E`,
    )) as any;
  }
}
