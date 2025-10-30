import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from '../../../common/dto';
import { AUTH_PATTERNS } from '../../../common/constants'

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

  @MessagePattern(AUTH_PATTERNS.VALIDATE_USER)
  validateUser(@Payload() user: Pick<RegisterUserDto, 'email' | 'password'>) {
    return this.authenticationService.validateUser(user.email, user.password);
  }
}
