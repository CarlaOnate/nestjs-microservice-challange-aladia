import { Module } from '@nestjs/common';
import { AuthenticationService } from './services/auth/authentication.service';
import { AuthenticationController } from './controllers/auth/authentication.controller';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/authentication/.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = `mongodb+srv://${configService.get('DB_USERNAME')}_db_user:${configService.get('DB_PASSWORD')}@nestjs-challenge.ora4ujs.mongodb.net/?appName=nestjs-challenge"`;
        return {
          uri: uri,
          dbName: configService.get('DB_NAME'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }])
  ],
  controllers: [AuthenticationController, UsersController],
  providers: [AuthenticationService, UsersService],
})
export class AuthenticationModule {}
