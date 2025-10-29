import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './users/dto/register-authentication.dto';
import { AUTH_PATTERNS, AUTH_CLIENT } from '../../../../common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto as ClientUserDto,
  RegisterUserDto as ClientRegisterUserDto } from '../../../../common/dto';

@Injectable()
export class AuthenticationService {
  constructor(@Inject(AUTH_CLIENT) private authClient: ClientProxy) {}

  heartbeat() {
    return this.authClient.send('auth.heartbeat', {});
  }

  register(registerUserDto: RegisterUserDto) {
    return this.authClient.send<ClientUserDto, ClientRegisterUserDto>(AUTH_PATTERNS.REGISTER, registerUserDto);
  }
}
