import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './auth/authentication.module';
import { MicroserviceOptions, RpcException, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule, {
      transport: Transport.TCP,
      options: {
        port: 3001
      }
    });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => new RpcException(errors)
  }))
  await app.listen();
}
bootstrap();
