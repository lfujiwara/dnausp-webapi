import { Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaClient } from '../prisma';
import {
  DistribuicaoInstitutoPorCnaeQuery,
  DistribuicaoInstitutoPorCnaeQueryOutput,
} from '@dnausp/core';

export class DistribuicaoInstitutoPorCnaeDbQueryPort extends DistribuicaoInstitutoPorCnaeQuery {
  static provider = {
    provide: DistribuicaoInstitutoPorCnaeQuery,
    useClass: DistribuicaoInstitutoPorCnaeDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  execute(): Promise<DistribuicaoInstitutoPorCnaeQueryOutput> {
    return this.client.$queryRaw`
      SELECT "atividadePrincipal" cnae, jsonb_object_agg("instituto", cnt) distribuicao
      FROM (SELECT instituto, "atividadePrincipal", count(*) cnt
            from "Socio"
                     LEFT JOIN "Empresa" E on E.id = "Socio"."empresaId"
            GROUP BY instituto, "atividadePrincipal"
           ) AS Q
      GROUP BY "atividadePrincipal";
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
  }
}
