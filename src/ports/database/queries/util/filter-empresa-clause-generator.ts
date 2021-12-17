import { FilterEmpresa } from '@dnausp/core';
import { Prisma } from '@prisma/client';

export enum EmpresaJoin {
  'Socio' = 'Socio',
  'Investimento' = 'Investimento',
  'Empresa' = 'Empresa',
  'Incubacao' = 'Incubacao',
}

export abstract class FilterEmpresaClauseGenerator {
  static generate(
    args: FilterEmpresa = {},
    joins: EmpresaJoin[] = [
      EmpresaJoin.Socio,
      EmpresaJoin.Investimento,
      EmpresaJoin.Empresa,
    ],
  ): Prisma.Sql {
    const institutoFilter = this.getInstitutoFilter(args);
    const tipoVinculoFilter = this.getTipoVinculoFilter(args);
    const origemInvestimentoFilter = this.getOrigemInvestimentoFilter(args);
    const atividadePrincipalFilters = this.getAtividadePrincipalFilters(args);
    const incubadoraFilter = this.getIncubadoraFilter(args);
    const anoFundacaoMinFilter = this.getAnoFundacaoMinFilter(args);
    const anoFundacaoMaxFilter = this.getAnoFundacaoMaxFilter(args);

    const conditions = [
      [institutoFilter, EmpresaJoin.Socio],
      [tipoVinculoFilter, EmpresaJoin.Socio],
      [origemInvestimentoFilter, EmpresaJoin.Investimento],
      [anoFundacaoMinFilter, EmpresaJoin.Empresa],
      [anoFundacaoMaxFilter, EmpresaJoin.Empresa],
      [incubadoraFilter, EmpresaJoin.Incubacao],
      ...(atividadePrincipalFilters || []).map((filter) => [
        filter,
        EmpresaJoin.Empresa,
      ]),
    ]
      .filter(
        ([f, join]) => f !== undefined && joins.includes(join as EmpresaJoin),
      )
      .map(([f]) => f);

    return conditions.length > 0
      ? Prisma.sql`where ${Prisma.join(conditions, ' and ')}`
      : Prisma.empty;
  }

  private static getAnoFundacaoMaxFilter(args: FilterEmpresa) {
    return args.anoFundacaoMax && args.anoFundacaoMax > 0
      ? Prisma.sql`E."anoFundacao" <= ${args.anoFundacaoMax}`
      : undefined;
  }

  private static getAnoFundacaoMinFilter(args: FilterEmpresa) {
    return args.anoFundacaoMin && args.anoFundacaoMin > 0
      ? Prisma.sql`E."anoFundacao" >= ${args.anoFundacaoMin}`
      : undefined;
  }

  private static getIncubadoraFilter(args: FilterEmpresa) {
    return args.incubadora && args.incubadora.length > 0
      ? Prisma.sql`I2."incubadora" IN (${Prisma.join(args.incubadora)})`
      : undefined;
  }

  private static getAtividadePrincipalFilters(args: FilterEmpresa) {
    return args.atividadePrincipal && args.atividadePrincipal.length > 0
      ? args.atividadePrincipal.map(
          (cnae) => Prisma.sql`starts_with(E."atividadePrincipal", ${cnae})`,
        )
      : undefined;
  }

  private static getOrigemInvestimentoFilter(args: FilterEmpresa) {
    return args.origemInvestimento && args.origemInvestimento.length > 0
      ? Prisma.sql`I."origem" IN (${Prisma.join(args.origemInvestimento)})`
      : undefined;
  }

  private static getTipoVinculoFilter(args: FilterEmpresa) {
    return args.tipoVinculo && args.tipoVinculo.length > 0
      ? Prisma.sql`S."tipoVinculo" IN (${Prisma.join(args.tipoVinculo)})`
      : undefined;
  }

  private static getInstitutoFilter(args: FilterEmpresa) {
    return args.instituto && args.instituto.length > 0
      ? Prisma.sql`S."instituto" IN (${Prisma.join(args.instituto)})`
      : undefined;
  }
}
