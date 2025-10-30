import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '../../../core/guards/jwt.guard';
import { JwtStrategy } from './authentication/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/gateway/.env',
      isGlobal: true,
    }),
    AuthenticationModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy],
})
export class GatewayModule {
  constructor() {
  }
}
