import { Inject, Injectable } from '@nestjs/common';
import { USER_PATTERNS, AUTH_CLIENT } from '../../../../../common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto as ClientUserDto } from '../../../../../common/dto';

@Injectable()
export class UsersService {
  constructor(@Inject(AUTH_CLIENT) private authClient: ClientProxy) {}

  findAll() {
    return this.authClient.send<ClientUserDto[]>(USER_PATTERNS.FIND_ALL, {});
  }
}
