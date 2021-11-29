import { Empresa } from '../../domain/empresa';
import { Result } from 'typescript-monads';
import { Faturamento } from '../../domain/faturamento';

export abstract class EmpresaDbPort {
  abstract upsertEmpresa(empresa: Empresa): Promise<Result<Empresa, string>>;

  abstract getEmpresa(id: string): Promise<Result<Empresa, string>>;

  abstract addFaturamentoToEmpresa(
    empresaId: string,
    faturamento: Faturamento[],
  ): Promise<Result<Empresa, string>>;

  abstract removeFaturamentoFromEmpresa(
    empresaId: string,
    anosFiscais: number[],
  ): Promise<Result<Empresa, string>>;
}
