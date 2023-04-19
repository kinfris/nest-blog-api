import { forwardRef, Module } from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { BloggersController } from './blogger.conroller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../posts/posts.module';
import { Blog, BlogSchema } from '../blogs/shemas/blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    forwardRef(() => PostsModule),
  ],
  controllers: [BloggersController],
  providers: [BloggerService],
  exports: [BloggerService],
})
export class BloggerModule {}
