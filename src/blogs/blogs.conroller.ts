import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { QueryFilterModel, QueryType } from '../models/queryFilter.model';
import { PostsService } from '../posts/posts.service';

type createPostDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

type updateBlogDto = {
  name: string;
  description: string;
  websiteUrl: string;
};

type CreatePostDto = {
  title: string;
  shortDescription: string;
  content: string;
};

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
  createBlog(@Body() dto: createPostDto) {
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
  }

  @Put('/:id')
  async updateBlog(
    @Param() { id }: { id: string },
    @Body() dto: updateBlogDto,
  ) {
    const isBlogFound = await this.blogService.updateBlog(
      id,
      dto.name,
      dto.description,
      dto.websiteUrl,
    );
    if (isBlogFound) {
      return;
    }
  }

  @Delete('/:id')
  async deleteBlog(@Param() { id }: { id: string }) {
    const isDeleted = await this.blogService.deleteBlog(id);
    if (isDeleted) {
      return;
    }
  }

  @Get('/:blogId/posts')
  getBlogPosts(
    @Param() { blogId }: { blogId: string },
    @Query() queryDto: QueryType,
  ) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.postsService.findPosts(queryFilters, blogId);
  }

  @Post('/:blogId/posts')
  async createPost(
    @Param() { blogId }: { blogId: string },
    @Body() dto: CreatePostDto,
  ) {
    const blog = await this.blogService.findBlogById(blogId);
    if (blog) {
      return await this.postsService.createPost(
        dto.title,
        dto.shortDescription,
        dto.content,
        blogId,
        blog.name,
      );
    }
  }
}
