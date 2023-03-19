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
import { QueryFilterModel, QueryType } from '../dto/queryFilter.model';
import { PostsService } from './posts.service';
import { BlogsService } from '../blogs/blogs.service';
import { CommentsService } from '../comments/comments.service';

type CreatePostDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type UpdatePostDto = {
  title: 'string';
  shortDescription: 'string';
  content: 'string';
  blogId: 'string';
};

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    @Inject(forwardRef(() => BlogsService))
    private readonly blogsService: BlogsService,
    @Inject(CommentsService) private readonly commentService: CommentsService,
  ) {}

  @Get()
  async findPosts(@Query() queryDto: QueryType) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.postsService.findPosts(queryFilters);
  }

  @Post()
  async createPost(@Body() dto: CreatePostDto) {
    const blog = await this.blogsService.findBlogById(dto.blogId);
    if (blog) {
      return await this.postsService.createPost(
        dto.title,
        dto.shortDescription,
        dto.content,
        dto.blogId,
        blog.name,
      );
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Get('/:id')
  async findPostById(@Param() { id }: { id: string }) {
    const post = await this.postsService.findPostById(id);
    if (post) {
      return post;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Put('/:id')
  @HttpCode(204)
  async updatePost(
    @Param() { id }: { id: string },
    @Body() dto: UpdatePostDto,
  ) {
    const isPostMatched = this.postsService.updatePost(id, dto);
    if (isPostMatched) {
      return;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deletePost(@Param() { id }: { id: string }) {
    const isDeleted = await this.postsService.deletePost(id);
    if (isDeleted) {
      return;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  @Get('/:postId/comments')
  async getPostComments(
    @Param() { postId }: { postId: string },
    @Query() queryDto: QueryType,
  ) {
    const post = await this.postsService.findPostById(postId);
    if (post) {
      const queryFilters = new QueryFilterModel(queryDto);
      return this.commentService.findPostComments(queryFilters, postId);
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
