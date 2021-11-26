import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtConfigProvider } from '../config/jwt-config.provider';
import { WhitelistAuthorizationService } from '../services/whitelist-authorization.service';
import { IAuthUser } from '../data/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly whitelist: WhitelistAuthorizationService,
    config: JwtConfigProvider,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.provide().secret,
    });
  }

  async validate(payload: any) {
    const isWhitelisted = await this.whitelist.authorizeLogin(payload.user);

    if (!isWhitelisted) return null;

    return {
      email: payload.email,
      name: payload.name,
      givenName: payload.givenName,
    } as IAuthUser;
  }
}
