import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    AuthenticationModule,
    ConfigModule.forRoot({
      envFilePath: 'apps/gateway/.env',
      isGlobal: true,
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
