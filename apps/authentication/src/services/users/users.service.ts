import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../authentication.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll() {
    return this.userRepository.findAll();
  }
}
