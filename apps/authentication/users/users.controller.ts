import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { USER_PATTERNS } from '../../../common/constants';
import { MessagePattern } from '@nestjs/microservices';

@Controller('users') // For organization purposes
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERNS.FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }
}
