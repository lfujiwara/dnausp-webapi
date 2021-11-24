import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  get() {
    return {
      status: 'ok',
      message: 'The service is up and running',
    };
  }
}
