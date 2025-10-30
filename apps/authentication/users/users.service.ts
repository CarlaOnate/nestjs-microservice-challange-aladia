import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { RegisterUserDto } from '../../../common/dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  registerUser(registerUserDto: RegisterUserDto) {
    return this.userRepository.create(registerUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({ email: email }); // password=true to return user with password field
  }

  findOneByEmailForAuth(email: string) {
    return this.userRepository.findOneForAuth({ email: email }); // password=true to return user with password field
  }

  findAll() {
    return this.userRepository.findAll();
  }
}
