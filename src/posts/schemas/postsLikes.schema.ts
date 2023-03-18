import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostLikesDocument = HydratedDocument<PostLikes>;

@Schema()
export class PostLikes {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  addedAt: Date;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  likeStatus: 'None' | 'Like' | 'Dislike';
}

export const PostLikesSchema = SchemaFactory.createForClass(PostLikes);

export type PostLikeStatusType = {
  postId: string;
  addedAt: Date;
  userId: string;
  login: string;
  likeStatus: 'None' | 'Like' | 'Dislike';
};
