import { Module } from '@nestjs/common';
import { UpsertEmpresaMutation } from './mutations/upsert-empresa';
import { PortsModule } from '../ports/ports.module';

@Module({
  imports: [PortsModule],
  providers: [UpsertEmpresaMutation],
  exports: [UpsertEmpresaMutation],
})
export class AppModule {}
