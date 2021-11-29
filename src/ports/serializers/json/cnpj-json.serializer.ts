import { CNPJ } from '../../../domain/cnpj';

export class CNPJJsonSerializer {
  static serialize(value: CNPJ): string {
    return value.get();
  }
}
