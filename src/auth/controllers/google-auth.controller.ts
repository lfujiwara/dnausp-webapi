import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from '../guards/google-oauth-guard';
import { JwtService } from '@nestjs/jwt';
import { GoogleOAuthConfigProvider } from '../config/google-oauth-config.provider';
import { WhitelistAuthorizationService } from '../services/whitelist-authorization.service';
import { LoginResponse } from '../data/login-response';
import { reduceGoogleUser } from '../data/reducers/google-user.reducer';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: GoogleOAuthConfigProvider,
    private readonly authn: WhitelistAuthorizationService,
  ) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  public getGoogle() {
    return { message: 'Google OAuth' };
  }

  @Get('redirect')
  @UseGuards(GoogleOAuthGuard)
  @Redirect()
  public async redirect(@Req() req) {
    const user = reduceGoogleUser(req.user);
    const payload: LoginResponse = (await this.authn.authorizeLogin(user))
      ? {
          status: 'OK',
          user,
        }
      : { status: 'DENIED', reason: 'WHITELIST' };
    const token = this.jwt.sign(payload);
    return {
      url: `${this.config.getRedirectUrl()}?token=${token}`,
      status: 302,
    };
  }
}
