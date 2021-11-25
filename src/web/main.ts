import { NestFactory } from '@nestjs/core';
import { WebModule } from './web.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

const setupCors = (app: INestApplication, config: ConfigService) => {
  const origin = config.get<string>('CORS_ORIGINS')?.split(',') || [];

  app.enableCors({
    credentials: true,
    origin,
  });
};

async function bootstrap() {
  const app = await NestFactory.create(WebModule);

  setupCors(app, app.get(ConfigService));

  await app.listen(3333);
}

bootstrap();

export {};
