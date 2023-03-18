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
import { QueryFilterModel, QueryType } from '../models/queryFilter.model';
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
    console.log(blog);
    if (blog) {
      return await this.postsService.createPost(
        dto.title,
        dto.shortDescription,
        dto.content,
        dto.blogId,
        blog.name,
      );
    }
  }

  @Get('/:id')
  async findPostById(@Param() { id }: { id: string }) {
    return this.postsService.findPostById(id);
  }

  @Put('/:id')
  async updatePost(
    @Param() { id }: { id: string },
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, dto);
  }

  @Delete('/:id')
  async deletePost(@Param() { id }: { id: string }) {
    return this.postsService.deletePost(id);
  }

  @Get('/:postId/comments')
  getPostComments(
    @Param() { postId }: { postId: string },
    @Query() queryDto: QueryType,
  ) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.commentService.findPostComments(queryFilters, postId);
  }
}
