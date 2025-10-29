import { Inject, Injectable } from '@nestjs/common';
import { AUTH_CLIENT } from '../../constant';
import { ClientProxy } from '@nestjs/microservices';
import { USER_PATTERNS,
  UserDto as ClientUserDto } from '@app/contracts';

@Injectable()
export class UsersService {
  constructor(@Inject(AUTH_CLIENT) private authClient: ClientProxy) {}

  findAll() {
    return this.authClient.send<ClientUserDto[]>(USER_PATTERNS.FIND_ALL, {});
  }
}
