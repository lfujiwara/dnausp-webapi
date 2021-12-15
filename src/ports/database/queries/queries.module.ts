import { Module } from '@nestjs/common';
import {
  CnaeGroupsCountQuery,
  CnaeGroupsCountYearlyRangeQuery,
} from '@dnausp/core';
import { CnaeGroupsCountDbQueryPort } from './cnae-groups-count.db-query-port';
import { CnaeGroupsCountYearlyRangeDbQueryPort } from './cnae-groups-count-yearly-range.db-query-port';

@Module({
  imports: [],
  providers: [
    {
      provide: CnaeGroupsCountQuery,
      useClass: CnaeGroupsCountDbQueryPort,
    },
    {
      provide: CnaeGroupsCountYearlyRangeQuery,
      useClass: CnaeGroupsCountYearlyRangeDbQueryPort,
    },
  ],
  exports: [CnaeGroupsCountQuery, CnaeGroupsCountYearlyRangeQuery],
})
export class QueriesModule {}
