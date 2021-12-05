import { CNAE } from '@dnausp/core';

export class CNAEJsonSerializer {
  static serialize(cnae: CNAE) {
    return cnae.get();
  }
}
