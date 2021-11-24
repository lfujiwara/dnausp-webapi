import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import {
  UpsertEmpresaMutation,
  UpsertEmpresaMutationInput,
} from '../app/mutations/upsert-empresa';
import { Result } from 'typescript-monads';
import {
  CnaeGroupsCountInput,
  EmpresaDbQueryPortPrisma,
} from '../ports/database/empresa.db-query-port.prisma';

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
    private readonly dbQueryPort: EmpresaDbQueryPortPrisma,
  ) {}

  @Put()
  upsert(
    @Body() input: UpsertEmpresaMutationInput | UpsertEmpresaMutationInput[],
  ) {
    return Promise.all(
      Array.isArray(input)
        ? input.map(this.upsertEmpresa.mutate.bind(this.upsertEmpresa))
        : [this.upsertEmpresa.mutate(input)],
    ).then(groupResults);
  }

  @Get('cnae/stats')
  async getCnaeStats(
    @Query('anoMin') _anoMin: string,
    @Query('anoMax') _anoMax: string,
  ) {
    const anoMin: number | undefined = parseInt(_anoMin, 10);
    const anoMax: number | undefined = parseInt(_anoMax, 10);

    const filter: CnaeGroupsCountInput = {};
    if (!isNaN(anoMin)) filter.anoMin = anoMin;
    if (!isNaN(anoMax)) filter.anoMax = anoMax;

    return this.dbQueryPort.execute(filter);
  }
}
