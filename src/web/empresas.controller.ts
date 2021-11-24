import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  UpsertEmpresaMutation,
  UpsertEmpresaMutationInput,
} from '../app/mutations/upsert-empresa';
import { Result } from 'typescript-monads';
import { EmpresaDbQueryPortPrisma } from '../ports/database/empresa.db-query-port.prisma';

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
  async getCnaeStats() {
    return this.dbQueryPort.execute();
  }
}
