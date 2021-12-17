import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  AddFaturamentoMutation,
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
  ) {}

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
}
