import { CNPJ } from './cnpj';
import { randomUUID } from 'crypto';
import { Result } from 'typescript-monads';
import { CNAE } from './cnae';
import { Faturamento } from './faturamento';

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
    faturamentos: Faturamento[];
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
    this._faturamentos = empresa.faturamentos;
  }

  _faturamentos: Faturamento[];

  public get faturamentos(): Faturamento[] {
    return this._faturamentos;
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
    faturamentos?: Faturamento[];
  }): Result<Empresa, string[]> {
    const errors: string[] = [];
    if (data.estrangeira && !data.idEstrangeira)
      errors.push('Empresa estrangeira sem id estrangeira');
    if (!data.estrangeira && !data.cnpj)
      errors.push('Empresa não estrangeira sem cnpj');
    if (!data.nomeFantasia && !data.razaoSocial)
      errors.push('Empresa sem nome ou razão social');

    const faturamentosResult = Empresa.validateFaturamentos(
      data.faturamentos || [],
    );
    if (faturamentosResult.isFail())
      errors.push(...faturamentosResult.unwrapFail());
    else data.faturamentos = faturamentosResult.unwrap();

    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(
      new Empresa({
        id: randomUUID(),
        ...data,
        faturamentos: data.faturamentos || [],
      }),
    );
  }

  static validateAnoDeFundacao(ano: string | number): Result<number, string> {
    const n = parseInt(ano + '', 10);

    if (isNaN(n) || n < 1900 || n > new Date().getFullYear())
      return Result.fail('Ano de fundação inválido');

    return Result.ok(n);
  }

  static validateFaturamentos(
    faturamentos: Faturamento[],
  ): Result<Faturamento[], string[]> {
    const anos = faturamentos.map((f) => f.anoFiscal);
    const anoSet = new Set(anos);
    if (anoSet.size !== anos.length)
      return Result.fail(['Anos de faturamento repetidos']);

    return Result.ok(faturamentos);
  }

  public addFaturamento(faturamento: Faturamento): Result<any, string> {
    if (this.faturamentos.find((f) => f.anoFiscal === faturamento.anoFiscal))
      return Result.fail('Faturamento para no ano fiscal já existente');

    this._faturamentos.push(faturamento);
    return Result.ok(undefined);
  }

  public removeFaturamento(anoFiscal: number): Result<any, string> {
    const l1 = this.faturamentos.length;
    this._faturamentos = this.faturamentos.filter(
      (f) => f.anoFiscal !== anoFiscal,
    );
    const l2 = this.faturamentos.length;

    if (l1 === l2) return Result.fail('Faturamento não encontrado');
    return Result.ok(undefined);
  }
}
