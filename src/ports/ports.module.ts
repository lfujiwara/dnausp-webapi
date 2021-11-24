import { Module } from '@nestjs/common';
import { EmpresaDbPort } from '../app/database/empresa.db-port';
import { EmpresaDbPortPrisma } from './database/empresa.db-port.prisma';
import { EmpresaDbQueryPortPrisma } from './database/empresa.db-query-port.prisma';

@Module({
  providers: [
    {
      provide: EmpresaDbPort,
      useClass: EmpresaDbPortPrisma,
    },
    EmpresaDbQueryPortPrisma,
  ],
  exports: [EmpresaDbPort, EmpresaDbQueryPortPrisma],
})
export class PortsModule {}
