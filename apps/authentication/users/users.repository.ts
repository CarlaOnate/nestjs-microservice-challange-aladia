import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { RegisterUserDto, UserDto } from '../../../common/dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    return await this.userModel.create(registerUserDto);
  }

  async findOne(query: Partial<UserDto>) {
    return await this.userModel.findOne(query).exec();
  }

  async findOneForAuth(query: Pick<UserDto, 'email'>) {
    return await this.userModel.findOne(query).select('+password').exec();
  }

  async findAll() {
    return await this.userModel.find().exec();
  }
}