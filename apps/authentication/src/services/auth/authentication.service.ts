import { Injectable } from '@nestjs/common';
import {
  RegisterUserDto,
} from '@app/contracts';
import { UserRepository } from '../../authentication.repository';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {
  }

  register(registerUserDto: RegisterUserDto) {
    return this.userRepository.create(registerUserDto);
  }
}
