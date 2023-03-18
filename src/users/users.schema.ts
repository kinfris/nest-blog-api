import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  passwordSalt: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
