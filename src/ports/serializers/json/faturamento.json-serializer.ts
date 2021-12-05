import { Faturamento } from '@dnausp/core';

export class FaturamentoJsonSerializer {
  static serialize(faturamento: Faturamento) {
    return {
      anoFiscal: faturamento.anoFiscal,
      valor: faturamento.valor,
    };
  }
}
