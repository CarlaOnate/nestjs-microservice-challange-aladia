import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/auth/authentication.service';
import { AuthenticationController } from './controllers/auth/authentication.controller';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';

@Module({
  controllers: [AuthenticationController, UsersController],
  providers: [AuthenticationService, UsersService],
})
export class AuthenticationModule {}
