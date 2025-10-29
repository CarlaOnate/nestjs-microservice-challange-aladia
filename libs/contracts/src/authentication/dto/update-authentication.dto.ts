import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user-authentication.dto';

export class UpdateAuthenticationDto extends PartialType(RegisterUserDto) {
  id: number;
}
