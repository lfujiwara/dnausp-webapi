import { NestFactory } from '@nestjs/core';
import { CnpjDataWorkerModule } from './cnpj-data-worker.module';

async function bootstrap() {
  const app = await NestFactory.create(CnpjDataWorkerModule);

  await app.listen(3334);
}

bootstrap();

export {};
