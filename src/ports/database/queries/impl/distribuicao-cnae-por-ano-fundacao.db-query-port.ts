import {
  DistribuicaoCnaePorAnoFundacaoQuery,
  DistribuicaoCnaePorAnoFundacaoQueryOutput,
} from '@dnausp/core';
import { PrismaClient } from '@prisma/client';
import { Optional } from '@nestjs/common';
import { prismaClient } from '../prisma';

export class DistribuicaoCnaePorAnoFundacaoDbQueryPort extends DistribuicaoCnaePorAnoFundacaoQuery {
  static provider = {
    provide: DistribuicaoCnaePorAnoFundacaoQuery,
    useClass: DistribuicaoCnaePorAnoFundacaoDbQueryPort,
  };

  constructor(@Optional() readonly client: PrismaClient = prismaClient) {
    super();
  }

  execute(): Promise<DistribuicaoCnaePorAnoFundacaoQueryOutput> {
    return this.client.$queryRaw`
    select "anoFundacao" ano, jsonb_object_agg("cnae", cnt) distribuicao
    from (
      select "anoFundacao", "atividadePrincipal" cnae, count(*) cnt
      from "Empresa" E
        group by "atividadePrincipal", "anoFundacao"
      ) as X
    group by "anoFundacao";
    `.then((res: DistribuicaoCnaePorAnoFundacaoQueryOutput) => {
      res.sort((a, b) => a.ano - b.ano);
      return res;
    });
  }
}
