import { FaturamentoDbQueryPort } from '../ports/database/queries/impl/faturamento.db-query-port';

const main = async () => {
  const port = new FaturamentoDbQueryPort();
  port
    .execute({
      atividadePrincipal: ['8599603'],
      anoFundacaoMin: 2010,
      anoFundacaoMax: 2020,
    })
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    });
};

main();
