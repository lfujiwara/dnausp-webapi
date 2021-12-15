import { Investimento, OrigemInvestimento } from '@dnausp/core';
import { Investimento as PrismaInvestimento } from '@prisma/client';

export class InvestimentosJsonSerializer {
  static serialize(investimento: Investimento) {
    return {
      anoFiscal: investimento.anoFiscal,
      valor: investimento.valor,
      origem: investimento.origem,
    };
  }

  static deserialize(i: PrismaInvestimento) {
    return new Investimento(
      i.anoFiscal,
      Number(i.valor),
      i.origem as OrigemInvestimento,
    );
  }
}
