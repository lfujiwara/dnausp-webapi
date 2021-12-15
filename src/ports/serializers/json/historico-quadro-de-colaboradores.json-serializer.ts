import {
  Faturamento,
  HistoricoQuadroDeColaboradores,
  QuadroDeColaboradores,
} from '@dnausp/core';
import { QuadroDeColaboradores as PrismaQ } from '@prisma/client';

export class HistoricoQuadroDeColaboradoresJsonSerializer {
  static serialize(historico: HistoricoQuadroDeColaboradores) {
    return historico.valores.map((f: Faturamento) => ({
      anoFiscal: f.anoFiscal,
      valor: f.valor,
    }));
  }

  static deserialize(quadros: PrismaQ[]) {
    return new HistoricoQuadroDeColaboradores(
      quadros.map(
        (f) => new QuadroDeColaboradores(f.anoFiscal, Number(f.valor)),
      ),
    );
  }
}
