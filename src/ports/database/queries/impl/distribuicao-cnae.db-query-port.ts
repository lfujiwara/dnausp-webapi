import {
  DistribuicaoCnaeQuery,
  DistribuicaoCnaeQueryOutput,
  FilterEmpresa,
} from '@dnausp/core';
import { Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';
import { FilterEmpresaClauseGenerator } from '../util/filter-empresa-clause-generator';
import { QueryResult } from '../util/query-result';

export class DistribuicaoCnaeDbQueryPort extends DistribuicaoCnaeQuery {
  static provider = {
    provide: DistribuicaoCnaeQuery,
    useClass: DistribuicaoCnaeDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  async execute(filter?: FilterEmpresa): Promise<DistribuicaoCnaeQueryOutput> {
    const whereClause = FilterEmpresaClauseGenerator.generate(filter);
    const select = Prisma.sql`
    select "atividadePrincipal" cnae, count(*)
      from "Empresa" E
               left join "Socio" S on E.id = S."empresaId"
               left join "Investimento" I on E.id = I."empresaId"
               left join "Incubacao" I2 on E.id = I2."empresaId"
    `;
    const groupBy = Prisma.sql`group by "atividadePrincipal"`;

    const query = Prisma.join([select, whereClause, groupBy], ' ');
    const queryResult: [{ cnae: string; count: number }] =
      await this.client.$queryRaw(query);

    const result = queryResult.reduce(
      (acc, { cnae, count }) => ({
        ...acc,
        [cnae]: count,
      }),
      {},
    );

    return (await QueryResult.build(
      this.client,
      result,
      Prisma.sql`
      select count(*) as count
        from "Empresa" E
                 left join "Socio" S on E.id = S."empresaId"
                 left join "Investimento" I on E.id = I."empresaId"
                 left join "Incubacao" I2 on E.id = I2."empresaId"
      ${whereClause}
    `,
    )) as any;
  }
}
