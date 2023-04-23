import { forwardRef, Module } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggersController } from './blogger.conroller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../posts/posts.module';
import { Blog, BlogSchema } from '../blogs/shemas/blogs.schema';
import { User, UserSchema } from '../users/shemas/users.schema';
import { BloggerUsersController } from './bloggerUsers.conroller';
import {
  UsersBannedForBLog,
  UsersBannedForBLogSchema,
} from './scheme/usrsBannedForBlog.schema';
import { BlogBan, BlogBanSchema } from '../blogs/shemas/blogBan.schema';

const schemas = [
  { name: Blog.name, schema: BlogSchema },
  { name: User.name, schema: UserSchema },
  { name: UsersBannedForBLog.name, schema: UsersBannedForBLogSchema },
  { name: BlogBan.name, schema: BlogBanSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas), forwardRef(() => PostsModule)],
  controllers: [BloggersController, BloggerUsersController],
  providers: [BloggerService],
  exports: [BloggerService],
})
export class BloggerModule {}
