import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestController } from './test.conroller';
import { TestService } from './test.service';
import { Post, PostSchema } from '../posts/schemas/posts.schema';
import { PostLikes, PostLikesSchema } from '../posts/schemas/postsLikes.schema';
import { Comment, CommentSchema } from '../comments/schemas/comments.schema';
import {
  CommentLikes,
  CommentLikesSchema,
} from '../comments/schemas/commentLikes.schema';
import { Blog, BlogSchema } from '../blogs/shemas/blogs.schema';
import { User, UserSchema } from '../users/shemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: PostLikes.name, schema: PostLikesSchema },
    ]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: CommentLikes.name, schema: CommentLikesSchema },
    ]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
