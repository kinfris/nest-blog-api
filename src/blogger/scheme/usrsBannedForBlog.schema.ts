import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersBannedForBLogDocument = HydratedDocument<UsersBannedForBLog>;

@Schema()
export class UsersBannedForBLog {
  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  isBanned: boolean;

  @Prop()
  banReason: string | null;

  @Prop()
  banDate: Date | null;
}

export const UsersBannedForBLogSchema =
  SchemaFactory.createForClass(UsersBannedForBLog);
