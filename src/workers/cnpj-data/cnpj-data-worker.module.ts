import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { PortsModule } from '../../ports/ports.module';
import { CnpjDataWorkerService } from './cnpj-data-worker.service';

@Module({
  imports: [PortsModule],
  providers: [
    {
      provide: Logger,
      useClass: ConsoleLogger,
    },
    CnpjDataWorkerService,
  ],
})
export class CnpjDataWorkerModule {}
