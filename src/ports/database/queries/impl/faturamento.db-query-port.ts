import { Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';
import { FilterEmpresaClauseGenerator } from '../util/filter-empresa-clause-generator';
import {
  FaturamentoQuery,
  FaturamentoQueryOutput,
  FilterEmpresa,
} from '@dnausp/core';
import { QueryResult } from '../util/query-result';

export class FaturamentoDbQueryPort extends FaturamentoQuery {
  static provider = {
    provide: FaturamentoQuery,
    useClass: FaturamentoDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  async execute(filter: FilterEmpresa): Promise<FaturamentoQueryOutput> {
    const clause = FilterEmpresaClauseGenerator.generate(filter);
    const select = Prisma.sql`
      select "anoFiscal" ano, avg(valor) "valor", count(*) "count"
      from (select array_agg(f."empresaId"), avg(f.valor) "valor", f."anoFiscal"
            from "Faturamento" f
                     left join "Empresa" E
                               on E.id = f."empresaId"
                     left join "Socio" S on E.id = S."empresaId"
                     left join "Investimento" I on E.id = I."empresaId"
            ${clause}
            group by f."anoFiscal", E.id
        ) Q1
      group by "anoFiscal"
      order by ano;
    `;
    const result = (await this.client.$queryRaw(select)) as any;

    return (await QueryResult.build(
      this.client,
      result,
      Prisma.sql`select count(*) "count"
            from "Faturamento" f
                     left join "Empresa" E
                               on E.id = f."empresaId"
                     left join "Socio" S on E.id = S."empresaId"
                     left join "Investimento" I on E.id = I."empresaId"
            ${clause}`,
    )) as any;
  }
}
