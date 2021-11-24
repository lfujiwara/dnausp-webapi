import { Empresa } from '../../domain/empresa';
import { Result } from 'typescript-monads';

export abstract class EmpresaDbPort {
  abstract upsertEmpresa(empresa: Empresa): Promise<Result<Empresa, string>>;
}
