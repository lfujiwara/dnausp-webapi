import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOAuthConfigProvider {
  constructor(private config: ConfigService) {}

  public getClientId(): string {
    return this.config.get('GOOGLE_CLIENT_ID');
  }

  public getClientSecret(): string {
    return this.config.get('GOOGLE_CLIENT_SECRET');
  }

  public getCallbackUrl(): string {
    return this.config.get('GOOGLE_CALLBACK_URL');
  }

  public getRedirectUrl(): string {
    return this.config.get('GOOGLE_REDIRECT_URL');
  }
}
