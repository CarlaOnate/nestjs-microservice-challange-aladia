import { Injectable } from '@nestjs/common';
import {
  RegisterUserDto,
} from '@app/contracts';
import { UserRepository } from '../../authentication.repository';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(registerUserDto: RegisterUserDto) {
    // Encrypt password before storing in DB
    const saltOrRounds = 10;
    const password: string = registerUserDto.password;
    const hashed_password: string = await bcrypt.hash(password, saltOrRounds);
    const user = {
      ...registerUserDto,
      password: hashed_password,
    }
    return this.userRepository.create(user);
  }
}
