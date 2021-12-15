import { CNPJ } from '@dnausp/core';

export class CNPJJsonSerializer {
  static serialize(value: CNPJ): string {
    return value.get();
  }

  static deserialize(value: string): CNPJ {
    return new CNPJ(value);
  }
}
