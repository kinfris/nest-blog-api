import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type UserEntityType = {
  login: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
};

@Schema()
export class User implements UserEntityType {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true, index: 'text' })
  login: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, index: 'text' })
  email: string;

  @Prop({ required: true })
  createdAt: Date;
  matchedField?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
