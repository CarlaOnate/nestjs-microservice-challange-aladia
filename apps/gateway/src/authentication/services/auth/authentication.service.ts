import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../dto/auth/register-authentication.dto';

@Injectable()
export class AuthenticationService {
  register(registerUserDto: RegisterUserDto) {
    return {
      ...registerUserDto,
      id: "someUUID123",
    };
  }
}
