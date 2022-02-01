import {
  DistribuicaoGeneroPorAnoFundacaoQuery,
  DistribuicaoGeneroPorAnoFundacaoQueryOutput,
} from '@dnausp/core';
import { Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';
import { QueryResult } from '../util/query-result';

export class DistribuicaoGeneroPorAnoFundacaoDbQueryPort extends DistribuicaoGeneroPorAnoFundacaoQuery {
  static provider = {
    provide: DistribuicaoGeneroPorAnoFundacaoQuery,
    useClass: DistribuicaoGeneroPorAnoFundacaoDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  async execute(): Promise<DistribuicaoGeneroPorAnoFundacaoQueryOutput> {
    const result = (await this.client.$queryRaw`
      select "anoFundacao",
             json_build_array(
                     jsonb_build_object('genero', 'M', 'qtd', SUM(case "isMale" when true then 1 else 0 end)),
                     jsonb_build_object('genero', 'F', 'qtd', SUM(case "isMale" when false then 1 else 0 end))
                 ) distribuicao
      from "Socio" s
               join "Empresa" E
                    on s."empresaId" = E.id
      where "isMale" is not null
      group by "anoFundacao";
    `.then((res: DistribuicaoGeneroPorAnoFundacaoQueryOutput) => {
      res.sort((a, b) => a.anoFundacao - b.anoFundacao);
      return res;
    })) as any;

    return (await QueryResult.build(
      this.client,
      result,
      Prisma.sql`select count(*)
      from "Socio" s
               join "Empresa" E
                    on s."empresaId" = E.id
      where "isMale" is not null`,
    )) as any;
  }
}
