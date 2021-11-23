import { WhitelistService } from './whitelist.service';
import { IAuthUser } from '../data/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WhitelistAuthorizationService {
  constructor(private whitelist: WhitelistService) {}

  public async authorizeLogin(user: IAuthUser): Promise<boolean> {
    return this.whitelist.isEmailAllowed(user.email);
  }
}
