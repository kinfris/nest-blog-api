import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type UserEntityType = {
  login: string;
  passwordHash: string;
  passwordSalt: number;
  email: string;
  createdAt: Date;
};

@Schema()
export class User implements UserEntityType {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  passwordSalt: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
