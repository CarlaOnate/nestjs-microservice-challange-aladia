import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './users/dto/register-user.dto';
import { AUTH_PATTERNS, AUTH_CLIENT } from '../../../../common/constants';
import { ClientProxy } from '@nestjs/microservices';
import {
  UserDto as ClientUserDto,
  RegisterUserDto as ClientRegisterUserDto, UserDto,
} from '../../../../common/dto';
import { switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { JWTResponse } from './dto/jwt.dto';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(@Inject(AUTH_CLIENT)
              private authClient: ClientProxy,
              private jwtService: JwtService) {}

  heartbeat() {
    return this.authClient.send('auth.heartbeat', {});
  }

  register(registerUserDto: RegisterUserDto): Observable<JWTResponse> {
    return this.authClient.send<ClientUserDto, ClientRegisterUserDto>(AUTH_PATTERNS.REGISTER, registerUserDto)
      .pipe(switchMap(user => {
        return of(this.login(user))
      }))
  }

  login(user: UserDto){
    const payload = { email: user.email, id: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }

  validateUser(email: string, password: string) {
    return this.authClient.send<ClientUserDto, Partial<ClientUserDto>>(AUTH_PATTERNS.VALIDATE_USER, { email, password })
  }
}
