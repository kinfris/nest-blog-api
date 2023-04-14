import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserTokensDocument = HydratedDocument<UserTokens>;

@Schema()
export class UserTokens {
  @Prop({ required: true })
  userId: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  invalidTokens: Array<string>;
}

export const UserTokensSchema = SchemaFactory.createForClass(UserTokens);
