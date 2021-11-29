import { Module } from '@nestjs/common';
import { UpsertEmpresaMutation } from './mutations/upsert-empresa';
import { PortsModule } from '../ports/ports.module';
import { AddFaturamentoMutation } from './mutations/add-faturamento';
import { RemoveFaturamentoMutation } from './mutations/remove-faturamento';

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
