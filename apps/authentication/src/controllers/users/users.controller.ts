import { Controller } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { USER_PATTERNS } from '@app/contracts';
import { MessagePattern } from '@nestjs/microservices';

@Controller('users') // For organization purposes
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERNS.FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }
}
