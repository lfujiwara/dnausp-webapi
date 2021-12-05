import { Module } from '@nestjs/common';
import { CnaeGroupsCountQuery } from '@dnausp/core';
import { CnaeGroupsCountDbQueryPort } from './cnae-groups-count.db-query-port';

@Module({
  providers: [
    {
      provide: CnaeGroupsCountQuery,
      useClass: CnaeGroupsCountDbQueryPort,
    },
  ],
  exports: [CnaeGroupsCountQuery],
})
export class QueriesModule {}
