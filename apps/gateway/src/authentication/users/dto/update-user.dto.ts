import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-authentication.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
