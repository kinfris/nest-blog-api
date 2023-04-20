import { forwardRef, Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.conroller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './shemas/blogs.schema';
import { PostsModule } from '../posts/posts.module';
import { SaBlogsController } from './saBlogs.conroller';
import { BlogBan, BlogBanSchema } from './shemas/blogBan.schema';

const scheme = [
  { name: Blog.name, schema: BlogSchema },
  { name: BlogBan.name, schema: BlogBanSchema },
];

@Module({
  imports: [MongooseModule.forFeature(scheme), forwardRef(() => PostsModule)],
  controllers: [BlogsController, SaBlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
