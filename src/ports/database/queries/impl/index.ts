import { DistribuicaoCnaeDbQueryPort } from './distribuicao-cnae.db-query-port';
import { DistribuicaoCnaePorAnoFundacaoDbQueryPort } from './distribuicao-cnae-por-ano-fundacao.db-query-port';
import { DistribuicaoCnaePorInstitutoDbQueryPort } from './distribuicao-cnae-por-instituto.db-query-port';
import { DistribuicaoGeneroDbQueryPort } from './distribuicao-genero.db-query-port';
import { DistribuicaoGeneroPorAnoFundacaoDbQueryPort } from './distribuicao-genero-por-ano-fundacao.db-query-port';
import { DistribuicaoGeneroPorInstitutoDbQueryPort } from './distribuicao-genero-por-instituto.db-query-port';
import { FaturamentoDbQueryPort } from './faturamento.db-query-port';
import { DistribuicaoInstitutoPorCnaeDbQueryPort } from './distribuicao-instituto-por-cnae.db-query-port';

const ports = [
  DistribuicaoCnaeDbQueryPort,
  DistribuicaoCnaePorAnoFundacaoDbQueryPort,
  DistribuicaoCnaePorInstitutoDbQueryPort,
  DistribuicaoGeneroDbQueryPort,
  DistribuicaoGeneroPorAnoFundacaoDbQueryPort,
  DistribuicaoGeneroPorInstitutoDbQueryPort,
  DistribuicaoCnaePorInstitutoDbQueryPort,
  DistribuicaoInstitutoPorCnaeDbQueryPort,
  FaturamentoDbQueryPort,
];

const providers = ports.map((p) => p.provider);
const exported = ports.map((p) => p.provider.provide);

export const queriesImpl = {
  providers,
  exported,
};
