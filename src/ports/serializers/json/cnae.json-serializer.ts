import { CNAE } from '../../../domain/cnae';

export class CNAEJsonSerializer {
  static serialize(cnae: CNAE) {
    return cnae.get();
  }
}
