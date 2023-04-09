import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { QueryFilterModel, QueryType } from '../dto/queryFilter.model';
import { PostsService } from '../posts/posts.service';
import { Matches, MaxLength } from 'class-validator';

class BlogDto {
  @MaxLength(15)
  name: string;
  @MaxLength(500)
  description: string;
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}

class CreatePostDto {
  @MaxLength(30)
  title: string;
  @MaxLength(100)
  shortDescription: string;
  @MaxLength(1000)
  content: string;
}

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  @Get()
  getBlogs(@Query() queryDto: QueryType) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.blogService.findBlogs(queryFilters);
  }

  @Post()
  createBlog(@Body() dto: BlogDto) {
    return this.blogService.createBlog(
      dto.name,
      dto.description,
      dto.websiteUrl,
    );
  }

  @Get('/:id')
  async getBlogById(@Param() { id }: { id: string }) {
    const blog = await this.blogService.findBlogById(id);
    if (blog) {
      return blog;
    }
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  @Put('/:id')
  @HttpCode(204)
  async updateBlog(@Param() { id }: { id: string }, @Body() dto: BlogDto) {
    await this.blogService.updateBlog(
      id,
      dto.name,
      dto.description,
      dto.websiteUrl,
    );
    return;
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBlog(@Param() { id }: { id: string }) {
    await this.blogService.deleteBlog(id);
    return;
  }

  @Get('/:blogId/posts')
  async getBlogPosts(
    @Param() { blogId }: { blogId: string },
    @Query() queryDto: QueryType,
  ) {
    await this.blogService.findBlogById(blogId);

    const queryFilters = new QueryFilterModel(queryDto);
    return this.postsService.findPosts(queryFilters, blogId);
  }

  @Post('/:blogId/posts')
  async createPost(
    @Param() { blogId }: { blogId: string },
    @Body() dto: CreatePostDto,
  ) {
    const blog = await this.blogService.findBlogById(blogId);
    return await this.postsService.createPost(
      dto.title,
      dto.shortDescription,
      dto.content,
      blogId,
      blog.name,
    );
  }
}
