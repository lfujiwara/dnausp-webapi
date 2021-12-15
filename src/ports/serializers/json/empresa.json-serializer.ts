import { Empresa } from '@dnausp/core';
import { CNPJJsonSerializer } from './cnpj-json.serializer';
import { CNAEJsonSerializer } from './cnae.json-serializer';
import * as Prisma from '@prisma/client';
import { HistoricoFaturamentosJsonSerializer } from './historico-faturamentos.json-serializer';
import { InvestimentosJsonSerializer } from './investimentos.json-serializer';
import { HistoricoQuadroDeColaboradoresJsonSerializer } from './historico-quadro-de-colaboradores.json-serializer';
import { IncubacaoJsonSerializer } from './incubacao.json-serializer';
import { SocioJsonSerializer } from './socio.json-serializer';

export class EmpresaJsonSerializer {
  static deserialize(
    empresa: Prisma.Empresa & {
      historicoFaturamentos: Prisma.Faturamento[];
      historicoInvestimentos: Prisma.Investimento[];
      historicoQuadroDeColaboradores: Prisma.QuadroDeColaboradores[];
      incubacoes: Prisma.Incubacao[];
      socios: Prisma.Socio[];
    },
  ) {
    return new Empresa({
      id: empresa.id,
      idEstrangeira: empresa.idEstrangeira,
      estrangeira: empresa.estrangeira,
      cnpj: CNPJJsonSerializer.deserialize(empresa.cnpj),
      razaoSocial: empresa.razaoSocial,
      nomeFantasia: empresa.nomeFantasia,
      anoFundacao: empresa.anoFundacao,
      atividadePrincipal: CNAEJsonSerializer.deserialize(
        empresa.atividadePrincipal,
      ),
      atividadeSecundaria: empresa.atividadeSecundaria.map(
        CNAEJsonSerializer.deserialize,
      ),
      situacao: empresa.situacao,
      historicoFaturamentos: HistoricoFaturamentosJsonSerializer.deserialize(
        empresa.historicoFaturamentos,
      ),
      historicoInvestimentos: empresa.historicoInvestimentos.map(
        InvestimentosJsonSerializer.deserialize.bind(empresa.id),
      ),
      historicoQuadroDeColaboradores:
        HistoricoQuadroDeColaboradoresJsonSerializer.deserialize(
          empresa.historicoQuadroDeColaboradores,
        ),
      incubacoes: empresa.incubacoes.map(
        IncubacaoJsonSerializer.deserialize.bind(empresa.id),
      ),
      socios: empresa.socios.map(SocioJsonSerializer.deserialize),
    });
  }

  static serialize(empresa: Empresa) {
    return {
      id: empresa.id,
      idEstrangeira: empresa.idEstrangeira || null,
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
      historicoFaturamentos: HistoricoFaturamentosJsonSerializer.serialize(
        empresa.historicoFaturamentos,
      ),
      historicoInvestimentos: empresa.historicoInvestimentos.map(
        InvestimentosJsonSerializer.serialize,
      ),
      historicoQuadroDeColaboradores:
        HistoricoQuadroDeColaboradoresJsonSerializer.serialize(
          empresa.historicoQuadroDeColaboradores,
        ),
      incubacoes: empresa.incubacoes.map(IncubacaoJsonSerializer.serialize),
      socios: empresa.socios.map(SocioJsonSerializer.serialize),
    };
  }
}
