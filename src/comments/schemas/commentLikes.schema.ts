import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentLikesDocument = HydratedDocument<CommentLikes>;

@Schema()
export class CommentLikes {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  commentId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  addedAt: Date;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  likeStatus: LikeStatusType;
}

export const CommentLikesSchema = SchemaFactory.createForClass(CommentLikes);

export type CommentLikesInfo = {
  commentId: string;
  addedAt: Date;
  userId: string;
  likeStatus: LikeStatusType;
};

export type LikeStatusType = 'None' | 'Like' | 'Dislike';
