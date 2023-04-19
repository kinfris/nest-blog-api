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
import { IsBlogExistValidator } from '../decorators/isBlogExist/isBlogExist.validator';
import { Blog, BlogSchema } from '../blogs/shemas/blogs.schema';
import { BanInfo, BanInfoSchema } from '../users/shemas/banInfo.schema';

const schemas = [
  { name: Post.name, schema: PostSchema },
  { name: PostLikes.name, schema: PostLikesSchema },
  { name: User.name, schema: UserSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: CommentLikes.name, schema: CommentLikesSchema },
  { name: User.name, schema: UserSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: BanInfo.name, schema: BanInfoSchema },
];

@Module({
  imports: [
    MongooseModule.forFeature(schemas),
    forwardRef(() => BlogsModule),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, JwtAuthGuard, IsBlogExistValidator],
  exports: [PostsService],
})
export class PostsModule {}
