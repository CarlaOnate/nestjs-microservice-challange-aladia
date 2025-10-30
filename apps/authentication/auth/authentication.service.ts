import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../../common/dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UsersService) {}

  async register(registerUserDto: RegisterUserDto) {
    const existingUser = await this.userService.findOneByEmail(registerUserDto.email);
    if (existingUser) throw new BadRequestException('Email already exists');

    // Encrypt password before storing in DB
    const password: string = registerUserDto.password;
    const hashed_password: string = await bcrypt.hash(password, 10);
    const user = {
      ...registerUserDto,
      password: hashed_password,
    }

    return await this.userService.registerUser(user); // User module has responsibility for User management
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmailForAuth(email);
    if (!user) throw new BadRequestException('User not found');

    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new BadRequestException('Password does not match');

    return user;
  }
}
