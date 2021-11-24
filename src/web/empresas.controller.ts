import { Body, Controller, Put } from '@nestjs/common';
import {
  UpsertEmpresaMutation,
  UpsertEmpresaMutationInput,
} from '../app/mutations/upsert-empresa';
import { Result } from 'typescript-monads';

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
  constructor(private readonly upsertEmpresa: UpsertEmpresaMutation) {}

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
}
