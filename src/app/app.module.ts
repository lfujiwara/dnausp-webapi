import { Module } from '@nestjs/common';
import { PortsModule } from '../ports/ports.module';
import {
  AddFaturamentoMutation,
  EmpresaDbPort,
  RemoveFaturamentoMutation,
  UpsertEmpresaMutation,
} from '@dnausp/core';

@Module({
  imports: [PortsModule],
  providers: [
    {
      provide: UpsertEmpresaMutation,
      useFactory: (port) => new UpsertEmpresaMutation(port),
      inject: [EmpresaDbPort],
    },
    {
      provide: AddFaturamentoMutation,
      useFactory: (port) => new AddFaturamentoMutation(port),
      inject: [EmpresaDbPort],
    },
    {
      provide: RemoveFaturamentoMutation,
      useFactory: (port) => new RemoveFaturamentoMutation(port),
      inject: [EmpresaDbPort],
    },
  ],
  exports: [
    UpsertEmpresaMutation,
    AddFaturamentoMutation,
    RemoveFaturamentoMutation,
  ],
})
export class AppModule {}
