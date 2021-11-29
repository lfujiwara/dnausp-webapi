import { Result } from 'typescript-monads';

export class CNPJ {
  private cnpj: string;

  constructor(cnpj: string) {
    this.set(CNPJ.unformatCNPJ(cnpj));
  }

  static create(cnpj: string): Result<CNPJ, string> {
    if (!_validateCNPJ(cnpj)) return Result.fail('CNPJ inválido');
    return Result.ok(new CNPJ(cnpj));
  }

  static unformatCNPJ(cnpj: string) {
    return cnpj.replace(/[^\d]+/g, '');
  }

  static formatCNPJ(cnpj: string) {
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      '$1.$2.$3/$4-$5',
    );
  }

  public get(): string {
    return this.cnpj;
  }

  public set(cnpj: string): void {
    if (!_validateCNPJ(cnpj)) throw new Error('CNPJ inválido');
    this.cnpj = CNPJ.unformatCNPJ(cnpj);
  }
}

const _validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14) return false;

  if (cnpj.split('').every((c) => c === cnpj[0])) return false;

  const digits = cnpj.split('').map((c) => parseInt(c));

  const dv1_rm =
    (digits.slice(0, 4).reduce((a, b, i) => a + b * (5 - i), 0) +
      digits.slice(4, 12).reduce((a, b, i) => a + b * (9 - i), 0)) %
    11;
  const dv1 = dv1_rm < 2 ? 0 : 11 - dv1_rm;
  if (dv1 !== digits[12]) return false;

  const dv2_rm =
    (digits.slice(0, 5).reduce((a, b, i) => a + b * (6 - i), 0) +
      digits.slice(5, 13).reduce((a, b, i) => a + b * (9 - i), 0)) %
    11;
  const dv2 = dv2_rm < 2 ? 0 : 11 - dv2_rm;
  return dv2 === digits[13];
};
