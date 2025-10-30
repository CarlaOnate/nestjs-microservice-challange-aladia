import { Request } from 'express';
import { UserDto } from './dto';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface RequestWithUser extends Request {
  user: UserDto;
}

export interface JwtPayload {
  email: string;
  id: string;
  exp: number;
}