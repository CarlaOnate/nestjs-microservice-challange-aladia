import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_CLIENT } from '../../../../common/constants';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

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
    }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.getOrThrow<string>(
              'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
            ),
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthenticationController, UsersController],
  providers: [AuthenticationService, UsersService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
