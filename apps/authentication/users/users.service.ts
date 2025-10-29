import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { RegisterUserDto } from '../../../common/dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  registerUser(registerUserDto: RegisterUserDto) {
    return this.userRepository.create(registerUserDto);
  }

  findAll() {
    return this.userRepository.findAll();
  }
}
