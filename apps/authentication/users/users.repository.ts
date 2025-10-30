import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { RegisterUserDto, UserDto } from '../../../common/dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(registerUserDto: RegisterUserDto) {
    return await this.userModel.create(registerUserDto);
  }

  async findAll() {
    return await this.userModel.find().exec();
  }
}