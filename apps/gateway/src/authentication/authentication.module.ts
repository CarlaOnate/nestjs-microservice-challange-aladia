import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/auth/authentication.service';
import { AuthenticationController } from './controllers/auth/authentication.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_CLIENT } from './constant';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/gateway/.env',
      isGlobal: true,
    }),
    ClientsModule.registerAsync([{
      name: AUTH_CLIENT,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          port: configService.get<number>('AUTH_MICROSERVICE_PORT', 3001),
        },
      }),
      inject: [ConfigService],
    }])
  ],
  controllers: [AuthenticationController, UsersController],
  providers: [AuthenticationService, UsersService],
})
export class AuthenticationModule {}
