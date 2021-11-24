import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { AuthModule } from '../auth/auth.module';
import { AppModule } from '../app/app.module';
import { HealthController } from './health.controller';

@Module({
  imports: [AuthModule, AppModule],
  controllers: [HealthController, EmpresasController],
})
export class WebModule {}
