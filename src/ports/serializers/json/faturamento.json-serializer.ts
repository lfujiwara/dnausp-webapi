import { Faturamento } from '../../../domain/faturamento';

export class FaturamentoJsonSerializer {
  static serialize(faturamento: Faturamento) {
    return {
      anoFiscal: faturamento.anoFiscal,
      valor: faturamento.valor,
    };
  }
}
