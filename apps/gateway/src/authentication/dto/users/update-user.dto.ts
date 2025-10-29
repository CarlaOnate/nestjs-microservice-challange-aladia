import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from '../auth/register-authentication.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
