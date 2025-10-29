import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  dummyUsers = [
    {
      id: "dummyUUID",
      firstName: "Elchi",
      lastName: "Penchi",
      email: "elchi@gmail.com",
      password: "1234password"
    },  {
      id: "dummyUUID-2",
      firstName: "Sphy",
      lastName: "Inaty",
      email: "sphy@gmail.com",
      password: "1234password"
    }
  ]

  findAll() {
    return this.dummyUsers;
  }
}
