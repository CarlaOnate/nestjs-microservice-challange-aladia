import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from '../../services/auth/authentication.service';
import {
  AUTH_PATTERNS,
  RegisterUserDto,
} from '@app/contracts';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('auth.heartbeat')
  heartbeat() {
    return "CONNECTION SUCCESSFUL";
  }

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  register(@Payload() registerUserDto: RegisterUserDto) {
    return this.authenticationService.register(registerUserDto);
  }
}
