import { forwardRef, Module } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggersController } from './blogger.conroller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../posts/posts.module';
import { Blog, BlogSchema } from '../blogs/shemas/blogs.schema';
import { User, UserSchema } from '../users/shemas/users.schema';

const schemas = [
  { name: Blog.name, schema: BlogSchema },
  { name: User.name, schema: UserSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas), forwardRef(() => PostsModule)],
  controllers: [BloggersController],
  providers: [BloggerService],
  exports: [BloggerService],
})
export class BloggerModule {}
