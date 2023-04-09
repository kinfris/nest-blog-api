import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostLikesDocument = HydratedDocument<PostLikes>;

@Schema()
export class PostLikes {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  addedAt: Date;

  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  likeStatus: 'None' | 'Like' | 'Dislike';
}

export const PostLikesSchema = SchemaFactory.createForClass(PostLikes);

export type PostLikeStatusType = {
  id: string;
  postId: string;
  addedAt: Date;
  userId: string;
  blogId: string;
  login: string;
  likeStatus: 'None' | 'Like' | 'Dislike';
};
