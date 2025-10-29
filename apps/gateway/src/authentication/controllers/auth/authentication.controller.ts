import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { RegisterUserDto } from '../../dto/auth/register-authentication.dto';
import { UserResponseDto } from '../../dto/users/user-response-authentication.dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  create(@Body() createAuthenticationDto: RegisterUserDto): UserResponseDto {
    const new_user = this.authenticationService.register(createAuthenticationDto);
    return plainToInstance(UserResponseDto, new_user, { excludeExtraneousValues: true });
  }
}
