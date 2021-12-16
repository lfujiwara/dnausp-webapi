import {
  Instituto,
  Socio,
  TipoVinculo,
  VinculoUniversidade,
} from '@dnausp/core';
import { Socio as PrismaSocio } from '@prisma/client';

export class SocioJsonSerializer {
  static serialize(
    socio: Socio,
  ): Omit<PrismaSocio, 'id' | 'empresaId' | 'isMale'> {
    return {
      nome: socio.nome,
      email: socio.email || null,
      telefone: socio.telefone || null,
      tipoVinculo: socio.vinculo?.tipo || null,
      NUSP: socio.vinculo?.NUSP || null,
      instituto: socio.vinculo?.instituto || null,
    };
  }

  static deserialize(s: PrismaSocio) {
    const vinculo = !s.tipoVinculo
      ? undefined
      : new VinculoUniversidade(
          s.tipoVinculo as TipoVinculo,
          s.NUSP || undefined,
          (s.instituto as Instituto) || undefined,
        );
    return new Socio(s.nome, s.email, s.telefone, vinculo);
  }
}
