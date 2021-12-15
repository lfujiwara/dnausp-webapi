import { EstadoIncubacao, Incubacao } from '@dnausp/core';
import { Incubacao as PrismaIncubacao } from '@prisma/client';

export class IncubacaoJsonSerializer {
  static serialize(incubacao: Incubacao) {
    return {
      incubadora: incubacao.incubadora,
      estado: incubacao.estado,
    };
  }

  static deserialize(i: PrismaIncubacao) {
    return new Incubacao(i.incubadora, i.estado as EstadoIncubacao);
  }
}
