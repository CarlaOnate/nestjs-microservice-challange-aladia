import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { RegisterUserDto } from "@app/contracts";
import { User } from './entities/user.entity';


@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createBookDto: RegisterUserDto) {
    return await this.userModel.create(createBookDto);
  }

  async findAll() {
    return await this.userModel.find().exec();
  }
}