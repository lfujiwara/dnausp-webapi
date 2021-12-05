import { CNPJ } from '@dnausp/core';

export class CNPJJsonSerializer {
  static serialize(value: CNPJ): string {
    return value.get();
  }
}
