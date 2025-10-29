import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../dto/auth/register-authentication.dto';
import { AUTH_CLIENT } from '../../constant';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS,
  UserDto as ClientUserDto,
  RegisterUserDto as ClientRegisterUserDto } from '@app/contracts';

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
