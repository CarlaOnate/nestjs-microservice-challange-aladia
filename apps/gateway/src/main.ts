import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformGatewayInterceptor } from '../../../core/interceptors/transform-gateway-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformGatewayInterceptor());
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
