import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [{
      id: "SOME UUID 2",
      firstName: "Dentro de",
      lastName: "AUTH microservice",
      email: "this findsall USERS",
      password: "auth/USERS"
    }]
  }
}
