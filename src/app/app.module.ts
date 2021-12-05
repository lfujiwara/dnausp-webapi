import { Module } from '@nestjs/common';
import { PortsModule } from '../ports/ports.module';
import {
  AddFaturamentoMutation,
  RemoveFaturamentoMutation,
  UpsertEmpresaMutation,
} from '@dnausp/core';

@Module({
  imports: [PortsModule],
  providers: [
    UpsertEmpresaMutation,
    AddFaturamentoMutation,
    RemoveFaturamentoMutation,
  ],
  exports: [
    UpsertEmpresaMutation,
    AddFaturamentoMutation,
    RemoveFaturamentoMutation,
  ],
})
export class AppModule {}
