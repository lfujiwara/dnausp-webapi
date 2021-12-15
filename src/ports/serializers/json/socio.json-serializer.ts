import {
  Instituto,
  Socio,
  TipoVinculo,
  VinculoUniversidade,
} from '@dnausp/core';
import { Socio as PrismaSocio } from '@prisma/client';

export class SocioJsonSerializer {
  static serialize(socio: Socio): Omit<PrismaSocio, 'id' | 'empresaId'> {
    return {
      nome: socio.nome,
      email: socio.email,
      telefone: socio.telefone,
      tipoVinculo: socio.vinculo?.tipo,
      NUSP: socio.vinculo?.NUSP,
      instituto: socio.vinculo?.instituto,
    };
  }

  static deserialize(s: PrismaSocio) {
    const vinculo = !s.tipoVinculo
      ? undefined
      : new VinculoUniversidade(
          s.tipoVinculo as TipoVinculo,
          s.NUSP,
          s.instituto as Instituto,
        );
    return new Socio(s.nome, s.email, s.telefone, vinculo);
  }
}
