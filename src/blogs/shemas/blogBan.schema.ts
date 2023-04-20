import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogBanDocument = HydratedDocument<BlogBan>;

@Schema()
export class BlogBan {
  @Prop({ required: true })
  blogId: string;

  @Prop()
  isBanned: boolean;

  @Prop()
  banDate: Date | null;
}

export const BlogBanSchema = SchemaFactory.createForClass(BlogBan);
