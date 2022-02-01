import { Optional } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';
import {
  DistribuicaoInstitutoPorCnaeQuery,
  DistribuicaoInstitutoPorCnaeQueryOutput,
} from '@dnausp/core';
import { QueryResult } from '../util/query-result';

export class DistribuicaoInstitutoPorCnaeDbQueryPort extends DistribuicaoInstitutoPorCnaeQuery {
  static provider = {
    provide: DistribuicaoInstitutoPorCnaeQuery,
    useClass: DistribuicaoInstitutoPorCnaeDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  async execute(): Promise<DistribuicaoInstitutoPorCnaeQueryOutput> {
    const result = this.client.$queryRaw`
      select "atividadePrincipal" cnae, jsonb_object_agg(instituto, cnt) distribuicao
      from (select instituto, "atividadePrincipal", count(*) cnt
            from "Empresa"
                     join "Socio" on "Empresa".id = "Socio"."empresaId"
            group by instituto, "atividadePrincipal") as Q1
      group by "atividadePrincipal";
    `.then(
      (
        res: {
          cnae: string;
          distribuicao: {
            [instituto: string]: number;
          };
        }[],
      ) =>
        res.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.cnae]: curr.distribuicao,
          }),
          {} as DistribuicaoInstitutoPorCnaeQueryOutput,
        ),
    );

    return (await QueryResult.build(
      this.client,
      result,
      Prisma.sql`
        select count(*) count
            from "Empresa"
                     join "Socio" on "Empresa".id = "Socio"."empresaId"`,
    )) as any;
  }
}
