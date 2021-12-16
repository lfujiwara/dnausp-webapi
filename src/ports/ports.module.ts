import { Module } from '@nestjs/common';
import { EmpresaDbPort } from '@dnausp/core';
import { QueriesModule } from './database/queries/queries.module';
import { HttpModule } from '@nestjs/axios';
import { EmpresaBrasilApiCnpjDataDbPortPrisma } from './database/empresa-brasil-api-cnpj-data.db-port.prisma';
import { BrasilApiCnpjDataService } from './services/brasil-api-cnpj-data.service';
import { EmpresaDbPortPrisma } from './database/empresa.db-port.prisma';
import { GenderInferrerModule } from './gender-inferrer/gender-inferrer.module';

@Module({
  imports: [QueriesModule, HttpModule, GenderInferrerModule],
  providers: [
    {
      provide: EmpresaDbPort,
      useClass: EmpresaDbPortPrisma,
    },
    EmpresaBrasilApiCnpjDataDbPortPrisma,
    BrasilApiCnpjDataService,
  ],
  exports: [
    EmpresaDbPort,
    QueriesModule,
    EmpresaBrasilApiCnpjDataDbPortPrisma,
    BrasilApiCnpjDataService,
  ],
})
export class PortsModule {}
