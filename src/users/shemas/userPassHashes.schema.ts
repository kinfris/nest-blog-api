import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserHashesDocument = HydratedDocument<UserHashes>;

@Schema()
export class UserHashes {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  passwordHashes: Array<string>;
}

export const UserHashesSchema = SchemaFactory.createForClass(UserHashes);
