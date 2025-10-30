import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../common/definitions';
import { Response } from 'express';

@Injectable()
export class TransformGatewayInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode: number = response.statusCode;

        return {
          success: true,
          statusCode,
          message: 'Request successful',
          data: data,
          timestamp: new Date().toISOString(),
        }
      })
    );
  }
}