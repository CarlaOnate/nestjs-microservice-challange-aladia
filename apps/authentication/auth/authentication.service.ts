import { Injectable } from '@nestjs/common';
import {
  RegisterUserDto,
} from '@app/contracts';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UsersService) {}

  async register(registerUserDto: RegisterUserDto) {
    // Encrypt password before storing in DB
    const saltOrRounds = 10;
    const password: string = registerUserDto.password;
    const hashed_password: string = await bcrypt.hash(password, saltOrRounds);
    const user = {
      ...registerUserDto,
      password: hashed_password,
    }
    return this.userService.registerUser(user); // User module has responsibility for User management
  }
}
