import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentLikesDocument = HydratedDocument<CommentLikes>;

@Schema()
export class CommentLikes {
  @Prop({ required: true })
  commentId: string;

  @Prop({ required: true })
  addedAt: Date;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  likeStatus: LikeStatusTYpe;
}

export const CommentLikesSchema = SchemaFactory.createForClass(CommentLikes);

export type CommentLikesInfo = {
  commentId: string;
  addedAt: Date;
  userId: string;
  likeStatus: LikeStatusTYpe;
};

type LikeStatusTYpe = 'None' | 'Like' | 'Dislike';
