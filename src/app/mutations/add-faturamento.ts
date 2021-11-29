import { EmpresaDbPort } from '../database/empresa.db-port';
import { Injectable } from '@nestjs/common';
import { Faturamento } from '../../domain/faturamento';
import { Result } from 'typescript-monads';
import { Empresa } from '../../domain/empresa';

export interface AddFaturamentoMutationInput {
  empresaId: string;
  anoFiscal: number;
  valor: number;
}

@Injectable()
export class AddFaturamentoMutation {
  constructor(private readonly port: EmpresaDbPort) {}

  async execute(
    input: AddFaturamentoMutationInput,
  ): Promise<Result<Empresa, string[]>> {
    const faturamentoResult = Faturamento.create(input.anoFiscal, input.valor);
    if (faturamentoResult.isFail())
      return Result.fail(faturamentoResult.unwrapFail());

    const empresaResult = await this.port.getEmpresa(input.empresaId);
    if (empresaResult.isFail()) return Result.fail(['Empresa não encontrada']);

    const empresa = empresaResult.unwrap();
    const addFaturamentoResult = empresa.addFaturamento(
      faturamentoResult.unwrap(),
    );

    if (addFaturamentoResult.isFail())
      return Result.fail([addFaturamentoResult.unwrapFail()]);

    const updateEmpresaResult = await this.port.addFaturamentoToEmpresa(
      empresa.id,
      [faturamentoResult.unwrap()],
    );

    return Result.ok(updateEmpresaResult.unwrap());
  }
}
