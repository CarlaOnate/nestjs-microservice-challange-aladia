import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';

@Schema()
export class User {
  _id: string; // Key handled by mongoose

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // Password should not show in query results
  password: string;

  @Prop({ default: Date.now() })
  createdDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

