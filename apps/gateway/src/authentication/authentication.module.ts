import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/auth/authentication.service';
import { AuthenticationController } from './controllers/auth/authentication.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/authentication/.env',
      isGlobal: true,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
