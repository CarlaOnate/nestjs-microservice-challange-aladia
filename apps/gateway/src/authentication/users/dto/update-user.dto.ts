import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import { IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsUUID()
  _id: string;
}
