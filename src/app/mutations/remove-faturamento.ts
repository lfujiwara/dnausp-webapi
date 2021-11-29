import { Injectable } from '@nestjs/common';
import { EmpresaDbPort } from '../database/empresa.db-port';
import { Result } from 'typescript-monads';
import { Empresa } from '../../domain/empresa';

export interface RemoveFaturamentoMutationInput {
  empresaId: string;
  anoFiscal: number;
}

@Injectable()
export class RemoveFaturamentoMutation {
  constructor(private readonly port: EmpresaDbPort) {}

  async execute(
    input: RemoveFaturamentoMutationInput,
  ): Promise<Result<Empresa, string[]>> {
    const empresaResult = await this.port.getEmpresa(input.empresaId);
    if (empresaResult.isFail()) return Result.fail(['Empresa não encontrada']);
    const empresa = empresaResult.unwrap();

    const faturamento = empresa.faturamentos.find(
      (f) => f.anoFiscal === input.anoFiscal,
    );
    if (!faturamento) return Result.fail(['Faturamento não encontrado']);

    const result = await this.port.removeFaturamentoFromEmpresa(empresa.id, [
      faturamento.anoFiscal,
    ]);

    return Result.ok(result.unwrap());
  }
}
