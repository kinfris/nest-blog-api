import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.conroller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/posts.schema';
import { BlogsModule } from '../blogs/blogs.module';
import { PostLikes, PostLikesSchema } from './schemas/postsLikes.schema';
import { CommentsModule } from '../comments/comments.module';
import { User, UserSchema } from '../users/shemas/users.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Comment, CommentSchema } from '../comments/schemas/comments.schema';
import {
  CommentLikes,
  CommentLikesSchema,
} from '../comments/schemas/commentLikes.schema';
import { Blog, BlogSchema } from '../blogs/shemas/blogs.schema';
import { IsBlogExistValidator } from '../decorators/isBlogExist/isBlogExist.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: PostLikes.name, schema: PostLikesSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: CommentLikes.name, schema: CommentLikesSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => BlogsModule),
    CommentsModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, JwtAuthGuard, IsBlogExistValidator],
  exports: [PostsService],
})
export class PostsModule {}
