import { Empresa } from '@dnausp/core';
import { CNPJJsonSerializer } from './cnpj-json.serializer';
import { CNAEJsonSerializer } from './cnae.json-serializer';
import { FaturamentoJsonSerializer } from './faturamento.json-serializer';

export class EmpresaJsonSerializer {
  static serialize(empresa: Empresa) {
    return {
      id: empresa.id,

      idEstrangeira: empresa.idEstrangeira,
      estrangeira: empresa.estrangeira,
      cnpj: CNPJJsonSerializer.serialize(empresa.cnpj),
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia,
      anoFundacao: empresa.anoFundacao,
      atividadePrincipal: CNAEJsonSerializer.serialize(
        empresa.atividadePrincipal,
      ),
      atividadeSecundaria: empresa.atividadeSecundaria.map(
        CNAEJsonSerializer.serialize,
      ),
      situacao: empresa.situacao,
      faturamentos: empresa.faturamentos.map(
        FaturamentoJsonSerializer.serialize,
      ),
    };
  }
}
