import * as data from './assets/cnae.json';
import { Result } from 'typescript-monads';

export class CNAE {
  private cnae: string;

  constructor(cnae) {
    this.set(CNAE.unformatCNAE(cnae));
  }

  static create(cnae): Result<CNAE, string> {
    if (!CNAE.validate(cnae)) return Result.fail(`CNAE ${cnae} inválido`);
    return Result.ok(new CNAE(cnae));
  }

  static unformatCNAE(cnae): string {
    return cnae.replace(/\D/g, '');
  }

  static formatCNAE(cnae: string) {
    return cnae.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1.$2.$3/$4');
  }

  static getSecao(cnae: string) {
    return cnaeToSecao(cnae);
  }

  static getDivisao(cnae: string) {
    return data.divisoes[cnae.substring(0, 2)];
  }

  static getGrupo(cnae: string) {
    return data.classes[cnae.substring(0, 3)];
  }

  static getClasse(cnae: string) {
    return data.classes[cnae.slice(0, 5)];
  }

  static validate(cnae: string): boolean {
    return !!data.subclasses[CNAE.unformatCNAE(cnae)];
  }

  public get() {
    return this.cnae;
  }

  public set(cnae: string) {
    if (!CNAE.validate(cnae)) throw new Error('CNAE inválido');
    this.cnae = cnae;
  }
}

type SecaoEntry = [number, number, string];

const isWithinSecao = (divisao: number, secaoEntry: SecaoEntry) => {
  const [min, max, key] = secaoEntry;
  if (divisao >= min && divisao <= max) return key;
};

const cnaeToSecao = (cnae: string) => {
  const divisao = parseInt(cnae.substring(0, 2), 10);
  for (const entry of secaoEntries) {
    const secao = isWithinSecao(divisao, entry);
    if (secao) return secao;
  }
};

const secaoEntries = [
  [1, 3, 'A'],
  [5, 9, 'B'],
  [10, 33, 'C'],
  [35, 35, 'D'],
  [36, 39, 'E'],
  [41, 43, 'F'],
  [45, 47, 'G'],
  [49, 53, 'H'],
  [55, 56, 'I'],
  [58, 63, 'J'],
  [64, 66, 'K'],
  [68, 68, 'L'],
  [69, 75, 'M'],
  [77, 82, 'N'],
  [84, 84, 'O'],
  [85, 85, 'P'],
  [86, 88, 'Q'],
  [90, 93, 'R'],
  [94, 96, 'S'],
  [97, 97, 'T'],
  [99, 99, 'U'],
] as [number, number, string][];
