import { CNAE } from '@dnausp/core';

export class CNAEJsonSerializer {
  static serialize(cnae: CNAE) {
    return cnae.get();
  }

  static deserialize(value: string) {
    return new CNAE(value);
  }
}
