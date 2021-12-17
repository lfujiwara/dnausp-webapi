import {
  DistribuicaoGeneroQuery,
  DistribuicaoGeneroQueryOutput,
} from '@dnausp/core';
import { Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';
import { FilterEmpresaClauseGenerator } from '../util/filter-empresa-clause-generator';

export class DistribuicaoGeneroDbQueryPort extends DistribuicaoGeneroQuery {
  static provider = {
    provide: DistribuicaoGeneroQuery,
    useClass: DistribuicaoGeneroDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  execute(): Promise<DistribuicaoGeneroQueryOutput> {
    const select = Prisma.sql`
    select (case "isMale" when true then 'M' else 'F' end) genero, count(*) qtd
from "Socio" S
         left join "Empresa" E on S."empresaId" = E.id
         left join "Investimento" I on E.id = I."empresaId"
         left join "Incubacao" I2 on E.id = I2."empresaId"
    `;

    const filterWhere = FilterEmpresaClauseGenerator.generate({});
    let where;
    if (filterWhere.sql === '') where = Prisma.sql`where "isMale" is not null`;
    else
      where = Prisma.join(
        [filterWhere, Prisma.sql`"isMale" is not null`],
        ' and ',
      );

    const groupBy = Prisma.sql`group by "isMale"`;
    const query = Prisma.join([select, where, groupBy], ' ');

    return this.client.$queryRaw(query);
  }
}
