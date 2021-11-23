import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-google-oauth20';
import { GoogleOAuthConfigProvider } from '../config/google-oauth-config.provider';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: GoogleOAuthConfigProvider) {
    super(
      {
        clientID: config.getClientId(),
        clientSecret: config.getClientSecret(),
        callbackURL: config.getCallbackUrl(),
        scope: 'email profile',
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile);
      },
    );
  }
}
