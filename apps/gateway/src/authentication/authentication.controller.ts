import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from './users/dto/register-user.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get()
  heartbeat() {
    return this.authenticationService.heartbeat();
  }

  @Post('register')
  create(@Body() createAuthenticationDto: RegisterUserDto) {
    return this.authenticationService.register(createAuthenticationDto);
  }
}

