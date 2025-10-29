import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../dto/users/user-response-authentication.dto';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): UserResponseDto[] {
    const users = this.usersService.findAll();
    return plainToInstance(UserResponseDto, users, { excludeExtraneousValues: true });
  }
}
