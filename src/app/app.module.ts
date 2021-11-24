import { Module } from '@nestjs/common';
import { UpsertEmpresaMutation } from './mutations/upsert-empresa';

@Module({
  providers: [UpsertEmpresaMutation],
  exports: [UpsertEmpresaMutation],
})
export class AppModule {}
