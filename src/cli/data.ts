import { EmpresasAnoFundacaoGroupbyQuery } from '../ports/database/queries/empresas-ano-fundacao-groupby.db-query-port';

const main = async () => {
  const port = new EmpresasAnoFundacaoGroupbyQuery();
  await port.execute().then(console.log);
};

main();
