import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BanInfoDocument = HydratedDocument<BanInfo>;

@Schema()
export class BanInfo {
  @Prop({ required: true })
  userId: string;

  @Prop()
  isBanned: boolean;

  @Prop()
  banReason: string | null;

  @Prop()
  banDate: Date | null;

  @Prop()
  banHistory: Array<{ banReason: string; banDate: Date }>;
}

export const BanInfoSchema = SchemaFactory.createForClass(BanInfo);
