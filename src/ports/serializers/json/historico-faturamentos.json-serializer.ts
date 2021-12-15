import { Faturamento, HistoricoFaturamentos } from '@dnausp/core/dist';
import { Faturamento as PrismaFaturamento } from '@prisma/client';

export class HistoricoFaturamentosJsonSerializer {
  static serialize(historico: HistoricoFaturamentos) {
    return historico.valores.map((f: Faturamento) => ({
      anoFiscal: f.anoFiscal,
      valor: f.valor,
    }));
  }

  static deserialize(faturamentos: PrismaFaturamento[]) {
    return new HistoricoFaturamentos(
      faturamentos.map((f) => new Faturamento(f.anoFiscal, Number(f.valor))),
    );
  }
}
