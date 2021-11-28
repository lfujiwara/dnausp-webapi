import { Module } from '@nestjs/common';
import { EmpresaDbPort } from '../app/database/empresa.db-port';
import { EmpresaDbPortPrisma } from './database/empresa.db-port.prisma';
import { QueriesModule } from './database/queries/queries.module';

@Module({
  imports: [QueriesModule],
  providers: [
    {
      provide: EmpresaDbPort,
      useClass: EmpresaDbPortPrisma,
    },
  ],
  exports: [EmpresaDbPort, QueriesModule],
})
export class PortsModule {}
