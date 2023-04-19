import { Module } from '@nestjs/common';
import { CommentsController } from './comments.conroller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comments.schema';
import {
  CommentLikes,
  CommentLikesSchema,
} from './schemas/commentLikes.schema';
import { User, UserSchema } from '../users/shemas/users.schema';
import { Post, PostSchema } from '../posts/schemas/posts.schema';
import { BanInfo, BanInfoSchema } from '../users/shemas/banInfo.schema';

const schemas = [
  { name: Comment.name, schema: CommentSchema },
  { name: CommentLikes.name, schema: CommentLikesSchema },
  { name: User.name, schema: UserSchema },
  { name: Post.name, schema: PostSchema },
  { name: BanInfo.name, schema: BanInfoSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
