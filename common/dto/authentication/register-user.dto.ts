import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// Entry point DTO

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 18)
  password: string;
}
