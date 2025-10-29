import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './authentication/services/auth/authentication.service';
import { UsersService } from './authentication/services/users/users.service';
import { AuthenticationController } from './authentication/controllers/auth/authentication.controller';
import { UsersController } from './authentication/controllers/users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/gateway/.env',
      isGlobal: true,
    }),
  ],
  controllers: [GatewayController, AuthenticationController, UsersController],
  providers: [GatewayService, AuthenticationService, UsersService],
})
export class GatewayModule {}
