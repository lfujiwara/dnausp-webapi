import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export interface IWhiteListService {
  isEmailAllowed(email: string): Promise<boolean>;
}

@Injectable()
export class WhitelistService implements IWhiteListService {
  private readonly whitelist: string[];

  constructor(config: ConfigService) {
    this.whitelist = config
      .get('AUTHORIZATION_EMAIL_WHITELIST')
      .split(',')
      .map((email) => email.toLowerCase().trim());
  }

  public async isEmailAllowed(email: string): Promise<boolean> {
    return this.whitelist.includes(email);
  }
}
