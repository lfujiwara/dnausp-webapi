import { CNPJ } from './cnpj';
import { randomUUID } from 'crypto';
import { Result } from 'typescript-monads';
import { CNAE } from './cnae';

export class Empresa {
  id: string;
  idEstrangeira?: number;
  estrangeira: boolean;
  cnpj?: CNPJ;
  razaoSocial?: string;
  nomeFantasia?: string;
  anoFundacao?: number;
  atividadePrincipal?: CNAE;
  atividadeSecundaria: CNAE[];
  situacao?: string;

  constructor(empresa: {
    id: string;
    idEstrangeira?: number;
    estrangeira: boolean;
    cnpj?: CNPJ;
    razaoSocial?: string;
    nomeFantasia?: string;
    anoFundacao?: number;
    atividadePrincipal?: CNAE;
    atividadeSecundaria: CNAE[];
    situacao?: string;
  }) {
    this.id = empresa.id;
    this.idEstrangeira = empresa.idEstrangeira;
    this.estrangeira = empresa.estrangeira;
    this.cnpj = empresa.cnpj;
    this.razaoSocial = empresa.razaoSocial;
    this.nomeFantasia = empresa.nomeFantasia;
    this.anoFundacao = empresa.anoFundacao;
    this.atividadePrincipal = empresa.atividadePrincipal;
    this.atividadeSecundaria = empresa.atividadeSecundaria;
    this.situacao = empresa.situacao;
  }

  static create(data: {
    idEstrangeira?: number;
    estrangeira: boolean;
    cnpj?: CNPJ;
    razaoSocial?: string;
    nomeFantasia?: string;
    anoFundacao?: number;
    atividadePrincipal?: CNAE;
    atividadeSecundaria: CNAE[];
    situacao?: string;
  }): Result<Empresa, string[]> {
    const errors: string[] = [];
    if (data.estrangeira && !data.idEstrangeira)
      errors.push('Empresa estrangeira sem id estrangeira');
    if (!data.estrangeira && !data.cnpj)
      errors.push('Empresa não estrangeira sem cnpj');
    if (!data.nomeFantasia && !data.razaoSocial)
      errors.push('Empresa sem nome ou razão social');

    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(new Empresa({ id: randomUUID(), ...data }));
  }

  static validateAnoDeFundacao(ano: string | number): Result<number, string> {
    const n = parseInt(ano + '', 10);

    if (isNaN(n) || n < 1900 || n > new Date().getFullYear())
      return Result.fail('Ano de fundação inválido');

    return Result.ok(n);
  }
}
