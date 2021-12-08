import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AddFaturamentoMutation,
  CnaeGroupsCountQuery,
  CnaeGroupsCountQueryInput,
  CnaeGroupsCountYearlyRangeQuery,
  RemoveFaturamentoMutation,
  UpsertEmpresaMutation,
  UpsertEmpresaMutationInput,
} from '@dnausp/core';
import { Result } from 'typescript-monads';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { EmpresaJsonSerializer } from '../ports/serializers/json/empresa.json-serializer';

const groupResults = <T, E>(
  results: Result<T, E>[],
): {
  ok: T[];
  fail: E[];
} =>
  results.reduce(
    (acc, curr) => {
      if (curr.isOk()) acc.ok.push(curr.unwrap());
      else acc.fail.push(curr.unwrapFail());
      return acc;
    },
    { ok: [], fail: [] },
  );

@Controller('empresas')
export class EmpresasController {
  constructor(
    private readonly upsertEmpresa: UpsertEmpresaMutation,
    private readonly addFaturamentoMutation: AddFaturamentoMutation,
    private readonly removeFaturamentoMutation: RemoveFaturamentoMutation,
    private readonly cnaeGroupsCountQuery: CnaeGroupsCountQuery,
    private readonly cnaeGroupsCountQueryYearlyRange: CnaeGroupsCountYearlyRangeQuery,
  ) {}

  private static extractCnaeStatsQueryParams(_anoMin: string, _anoMax: string) {
    const anoMin: number | undefined = parseInt(_anoMin, 10);
    const anoMax: number | undefined = parseInt(_anoMax, 10);

    const filter: CnaeGroupsCountQueryInput = {};
    if (!isNaN(anoMin)) filter.anoMin = anoMin;
    if (!isNaN(anoMax)) filter.anoMax = anoMax;
    return filter;
  }

  @Put()
  @UseGuards(JwtGuard)
  upsert(
    @Body() input: UpsertEmpresaMutationInput | UpsertEmpresaMutationInput[],
  ) {
    return Promise.all(
      Array.isArray(input)
        ? input.map(this.upsertEmpresa.mutate.bind(this.upsertEmpresa))
        : [this.upsertEmpresa.mutate(input)],
    ).then(groupResults);
  }

  @Post(':empresaId/faturamentos/:anoFiscal')
  @UseGuards(JwtGuard)
  async addFaturamento(
    @Param('empresaId') empresaId: string,
    @Param('anoFiscal', ParseIntPipe) anoFiscal: number,
    @Body('valor', ParseIntPipe) valor: number,
  ) {
    const result = await this.addFaturamentoMutation.execute({
      empresaId,
      anoFiscal,
      valor,
    });
    if (result.isOk()) return EmpresaJsonSerializer.serialize(result.unwrap());

    throw new BadRequestException(result.unwrapFail());
  }

  @Delete(':empresaId/faturamentos/:anoFiscal')
  @UseGuards(JwtGuard)
  async removeFaturamento(
    @Param('empresaId') empresaId: string,
    @Param('anoFiscal', ParseIntPipe) anoFiscal: number,
  ) {
    const result = await this.removeFaturamentoMutation.execute({
      empresaId,
      anoFiscal,
    });
    if (result.isOk()) return EmpresaJsonSerializer.serialize(result.unwrap());

    throw new BadRequestException(result.unwrapFail());
  }

  @Get('cnae/stats')
  @UseGuards(JwtGuard)
  async getCnaeStats(
    @Query('anoMin') _anoMin: string,
    @Query('anoMax') _anoMax: string,
  ) {
    const filter = EmpresasController.extractCnaeStatsQueryParams(
      _anoMin,
      _anoMax,
    );

    return this.cnaeGroupsCountQuery.execute(filter);
  }

  @Get('cnae/stats/yearly')
  @UseGuards(JwtGuard)
  async getCnaeStatsYearly(
    @Query('anoMin') _anoMin: string,
    @Query('anoMax') _anoMax: string,
  ) {
    const filter = EmpresasController.extractCnaeStatsQueryParams(
      _anoMin,
      _anoMax,
    );

    return this.cnaeGroupsCountQueryYearlyRange.execute(filter);
  }
}
