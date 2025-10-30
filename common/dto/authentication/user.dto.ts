import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}