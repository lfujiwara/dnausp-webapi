import { Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';
import { FilterEmpresaClauseGenerator } from '../util/filter-empresa-clause-generator';
import {
  FaturamentoQuery,
  FaturamentoQueryOutput,
  FilterEmpresa,
} from '@dnausp/core';

export class FaturamentoDbQueryPort extends FaturamentoQuery {
  static provider = {
    provide: FaturamentoQuery,
    useClass: FaturamentoDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  execute(filter: FilterEmpresa): Promise<FaturamentoQueryOutput> {
    const clause = FilterEmpresaClauseGenerator.generate(filter);
    const select = Prisma.sql`
      select f."anoFiscal", round(avg(f.valor)) "valor"
      from "Faturamento" f
               left join "Empresa" E on E.id = f."empresaId"
               left join "Socio" S on E.id = S."empresaId"
               left join "Investimento" I on E.id = I."empresaId"
    `;
    const groupBy = Prisma.sql`group by f."anoFiscal"`;

    return this.client.$queryRaw(Prisma.join([select, clause, groupBy], ' '));
  }
}
