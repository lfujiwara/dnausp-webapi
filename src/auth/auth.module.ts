import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleOAuthConfigProvider } from './config/google-oauth-config.provider';
import { GoogleOAuthStrategy } from './strategies/google-oauth-strategy.service';
import { GoogleOAuthGuard } from './guards/google-oauth-guard';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { JwtConfigProvider } from './config/jwt-config.provider';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { WhitelistService } from './services/whitelist.service';
import { WhitelistAuthorizationService } from './services/whitelist-authorization.service';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({})],
  controllers: [GoogleAuthController],
  providers: [
    WhitelistService,
    WhitelistAuthorizationService,
    GoogleOAuthConfigProvider,
    GoogleOAuthStrategy,
    GoogleOAuthGuard,
    JwtConfigProvider,
    JwtStrategy,
    JwtGuard,
    {
      provide: JwtService,
      useFactory: (config: JwtConfigProvider) =>
        new JwtService({ ...config.provide() }),
      inject: [JwtConfigProvider],
    },
  ],
  exports: [JwtGuard],
})
export class AuthModule {}
