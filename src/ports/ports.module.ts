import { Module } from '@nestjs/common';
import { EmpresaDbPort } from '../app/database/empresa.db-port';
import { EmpresaDbPortPrisma } from './database/empresa.db-port.prisma';

@Module({
  providers: [
    {
      provide: EmpresaDbPort,
      useClass: EmpresaDbPortPrisma,
    },
  ],
  exports: [EmpresaDbPort],
})
export class PortsModule {}
