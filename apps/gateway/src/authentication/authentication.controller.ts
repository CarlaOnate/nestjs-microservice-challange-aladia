import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterUserDto } from './users/dto/register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../../../../core/decorators/public.decorator';
import { type RequestWithUser } from '../../../../common/definitions';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Get()
  heartbeat() {
    return this.authenticationService.heartbeat();
  }

  @Public()
  @Post('register')
  create(@Body() createAuthenticationDto: RegisterUserDto) {
    return this.authenticationService.register(createAuthenticationDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: RequestWithUser) {
    return this.authenticationService.login(req.user);
  }
}

