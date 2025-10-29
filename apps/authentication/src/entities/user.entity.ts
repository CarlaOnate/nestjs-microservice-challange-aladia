import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class User {
  _id: string;  // Key handled by mongoose

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

