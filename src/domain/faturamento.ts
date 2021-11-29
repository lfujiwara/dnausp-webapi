import { Result } from 'typescript-monads';

export class Faturamento {
  public readonly valor: number;
  public readonly anoFiscal: number;

  constructor(value: number, anoFiscal: number) {
    const valorResult = Faturamento.validateValor(value);
    const anoFiscalResult = Faturamento.validateAno(anoFiscal);

    if (valorResult.isFail() || anoFiscalResult.isFail())
      throw new Error(
        [
          'Faturamento inválido',
          ...[valorResult, anoFiscalResult]
            .filter((r) => r.isFail())
            .map((r) => r.unwrapFail()),
        ].join('\n'),
      );

    this.valor = Faturamento.normalize(value);
    this.anoFiscal = anoFiscal;

    Object.freeze(this);
  }

  public static create(
    anoFiscal: number,
    valor: number,
  ): Result<Faturamento, string[]> {
    const valorResult = Faturamento.validateValor(valor);
    const anoFiscalResult = Faturamento.validateAno(anoFiscal);

    if (valorResult.isFail() || anoFiscalResult.isFail())
      return Result.fail(
        [valorResult, anoFiscalResult]
          .filter((r) => r.isFail())
          .map((r) => r.unwrapFail()),
      );

    return Result.ok(new Faturamento(valor, anoFiscal));
  }

  private static validateValor(valor: number): Result<any, string> {
    if (isNaN(valor)) return Result.fail('Valor inválido (não é número)');
    if (!Number.isSafeInteger(valor))
      return Result.fail('Valor inválido (não é inteiro)');

    return Result.ok(undefined);
  }

  private static validateAno(ano: number): Result<any, string> {
    if (isNaN(ano)) return Result.fail('Valor inválido (não é número)');
    if (!Number.isSafeInteger(ano))
      return Result.fail('Valor inválido (não é inteiro)');
    if (ano < 0) return Result.fail('Valor inválido (ano negativo)');

    return Result.ok(undefined);
  }

  private static normalize(value: number): number {
    return Math.round(value);
  }
}
