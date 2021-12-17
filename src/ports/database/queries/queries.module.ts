import { Module } from '@nestjs/common';
import { queriesImpl } from './impl';

@Module({
  imports: [],
  providers: [...queriesImpl.providers],
  exports: [...queriesImpl.exported],
})
export class QueriesModule {}
