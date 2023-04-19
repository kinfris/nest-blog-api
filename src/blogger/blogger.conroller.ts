import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  UseGuards,
} from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { QueryFilterModel, QueryType } from '../dto/queryFilter.model';
import { PostsService } from '../posts/posts.service';
import { Matches, MaxLength } from 'class-validator';
import { IsNotEmptyString } from '../decorators/isNotEmptyString';
import { CurrentUser } from '../decorators/current-user.param.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostDto } from '../posts/posts.conroller';

class BlogDto {
  @IsNotEmptyString()
  @MaxLength(15)
  name: string;
  @IsNotEmptyString()
  @MaxLength(500)
  description: string;
  @IsNotEmptyString()
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  websiteUrl: string;
}

class CreatePostDto {
  @IsNotEmptyString()
  @MaxLength(30)
  title: string;
  @IsNotEmptyString()
  @MaxLength(100)
  shortDescription: string;
  @IsNotEmptyString()
  @MaxLength(1000)
  content: string;
}

@Controller('/blogger/blogs')
export class BloggersController {
  constructor(
    private bloggerService: BloggerService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getBlogs(@Query() queryDto: QueryType, @CurrentUser() currentUser) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.bloggerService.findBlogsByBlogger(
      queryFilters,
      currentUser?.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createBlog(@Body() dto: BlogDto, @CurrentUser() currentUser) {
    return this.bloggerService.createBlog(
      dto.name,
      dto.description,
      dto.websiteUrl,
      currentUser?.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getBlogById(@Param() { id }: { id: string }) {
    const blog = await this.bloggerService.findBlogById(id);
    if (blog) {
      return blog;
    }
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @HttpCode(204)
  async updateBlog(
    @Param() { id }: { id: string },
    @Body() dto: BlogDto,
    @CurrentUser() currentUser,
  ) {
    await this.bloggerService.updateBlog(
      id,
      dto.name,
      dto.description,
      dto.websiteUrl,
      currentUser?.userId,
    );
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteBlog(
    @Param() { id }: { id: string },
    @CurrentUser() currentUser,
  ) {
    await this.bloggerService.deleteBlog(id, currentUser?.userId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:blogId/posts')
  async getBlogPosts(
    @Param() { blogId }: { blogId: string },
    @Query() queryDto: QueryType,
    @CurrentUser() currentUser,
  ) {
    await this.bloggerService.findBlogById(blogId);

    const queryFilters = new QueryFilterModel(queryDto);
    return this.postsService.findPosts(
      queryFilters,
      blogId,
      currentUser?.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:blogId/posts')
  async createPost(
    @Param() { blogId }: { blogId: string },
    @Body() dto: CreatePostDto,
    @CurrentUser() currentUser,
  ) {
    const blog = await this.bloggerService.isBlogByExist(blogId);
    if (blog.bloggerId !== currentUser.userId) throw new ForbiddenException();
    return await this.postsService.createPost(
      dto.title,
      dto.shortDescription,
      dto.content,
      blogId,
      blog.name,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:blogId/posts/:id')
  @HttpCode(204)
  async updatePost(
    @Param() { blogId, id }: { blogId: string; id: string },
    @Body() dto: PostDto,
    @CurrentUser() currentUser,
  ) {
    if (blogId !== currentUser.userId) throw new ForbiddenException();
    await this.postsService.updatePost(id, dto);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:blogId/posts/:id')
  @HttpCode(204)
  async deletePost(
    @Param() { blogId, id }: { blogId: string; id: string },
    @CurrentUser() currentUser,
  ) {
    if (blogId !== currentUser.userId) throw new ForbiddenException();
    await this.postsService.deletePost(id);
    return;
  }
}
