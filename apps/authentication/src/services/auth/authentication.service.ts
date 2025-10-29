import { Injectable } from '@nestjs/common';
import {
  RegisterUserDto,
} from '@app/contracts';

@Injectable()
export class AuthenticationService {
  register(createAuthenticationDto: RegisterUserDto) {
    return {
      firstName: "Dentro de",
      lastName: "AUTH microservice",
      email: "this registers and user",
    };
  }
}
