import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';

@Controller('auth/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
