import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  _id: ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  userId: ObjectId;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  likesCount: number;

  @Prop({ required: true })
  dislikesCount: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  postId: ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export interface IComment {
  _id: ObjectId;
  content: string;
  userId: ObjectId;
  userLogin: string;
  createdAt: Date;
  likesCount: number;
  dislikesCount: number;
  postId: ObjectId;
}
