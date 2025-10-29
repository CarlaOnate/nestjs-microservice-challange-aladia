import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';

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
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService]
})
export class UsersModule {}
