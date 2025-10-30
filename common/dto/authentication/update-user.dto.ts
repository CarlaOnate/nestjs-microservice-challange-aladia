import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import { IsUUID } from 'class-validator';

// Entry point DTO

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsUUID()
  id: number;
}
