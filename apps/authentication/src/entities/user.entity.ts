import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class User {
  _id: string;  // Key handled by mongoose

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

