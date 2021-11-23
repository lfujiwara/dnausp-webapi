import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class JwtConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  public provide(): JwtModuleOptions {
    return {
      secret: this.configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    };
  }
}
