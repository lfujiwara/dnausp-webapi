import { PipeTransform } from '@nestjs/common';
import { FilterEmpresa } from '@dnausp/core';

export class FilterEmpresaPipe implements PipeTransform {
  private static toFilterArray(value: any) {
    if (Array.isArray(value)) {
      return value;
    }
    if (value) {
      return [value];
    }
    return [];
  }

  private static toNumberOrUndef(_value: any) {
    const value = Number(_value);
    if (Number.isNaN(value)) return undefined;
    return value;
  }

  transform(query: Partial<FilterEmpresa>): FilterEmpresa {
    const atividadePrincipal = Array.isArray(query.atividadePrincipal)
      ? query.atividadePrincipal
      : (query.atividadePrincipal && [query.atividadePrincipal]) || undefined;

    return {
      atividadePrincipal: FilterEmpresaPipe.toFilterArray(atividadePrincipal),
      instituto: FilterEmpresaPipe.toFilterArray(query.instituto),
      tipoVinculo: FilterEmpresaPipe.toFilterArray(query.tipoVinculo),
      incubadora: FilterEmpresaPipe.toFilterArray(query.incubadora),
      origemInvestimento: FilterEmpresaPipe.toFilterArray(
        query.origemInvestimento,
      ),
      anoFundacaoMin: FilterEmpresaPipe.toNumberOrUndef(query.anoFundacaoMin),
      anoFundacaoMax: FilterEmpresaPipe.toNumberOrUndef(query.anoFundacaoMax),
    };
  }
}
