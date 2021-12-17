import { FaturamentoDbQueryPort } from '../ports/database/queries/impl/faturamento.db-query-port';
import { FilterEmpresa, Instituto } from '@dnausp/core';

const main = async () => {
  const args: FilterEmpresa = {
    instituto: [Instituto.IME],
  };
  const port = new FaturamentoDbQueryPort();
  port.execute(args).then((result) => {
    console.log(JSON.stringify(result, null, 2));
  });
};

main();
