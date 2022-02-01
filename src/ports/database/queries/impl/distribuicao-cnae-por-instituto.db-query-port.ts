import {
  DistribuicaoCnaePorInstitutoQuery,
  DistribuicaoCnaePorInstitutoQueryOutput,
} from '@dnausp/core';
import { Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';
import { QueryResult } from '../util/query-result';

export class DistribuicaoCnaePorInstitutoDbQueryPort extends DistribuicaoCnaePorInstitutoQuery {
  static provider = {
    provide: DistribuicaoCnaePorInstitutoQuery,
    useClass: DistribuicaoCnaePorInstitutoDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  async execute(): Promise<DistribuicaoCnaePorInstitutoQueryOutput> {
    const queryRes = (await this.client.$queryRaw`
    select "instituto", jsonb_object_agg("cnae", cnt) distribuicao
    from (select "instituto", "atividadePrincipal" cnae, count(*) cnt
          from "Empresa" E
                   left join "Socio" S on E.id = S."empresaId"
          where instituto is not null
          group by "atividadePrincipal", "instituto") as X
    group by "instituto";
    `.then(
      (
        res: {
          instituto: string;
          distribuicao: { [cnae: string]: number };
        }[],
      ) =>
        res.reduce(
          (acc, curr) => ({ ...acc, [curr.instituto]: curr.distribuicao }),
          {},
        ),
    )) as any;

    return (await QueryResult.build(
      this.client,
      queryRes,
      Prisma.sql`select count(*) count from "Empresa" E`,
    )) as any;
  }
}
