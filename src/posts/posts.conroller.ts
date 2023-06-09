import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryFilterModel, QueryType } from '../dto/queryFilter.model';
import { PostsService } from './posts.service';
import { BlogsService } from '../blogs/blogs.service';
import { CommentsService } from '../comments/comments.service';
import { UpdateDto } from '../comments/comments.conroller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.param.decorator';
import { IsIn, IsString, MaxLength } from 'class-validator';
import { IsNotEmptyString } from '../decorators/isNotEmptyString';

export class PostDto {
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

export class LikeStatusDto {
  @IsString()
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: 'None' | 'Like' | 'Dislike';
}

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    @Inject(forwardRef(() => BlogsService))
    private readonly blogsService: BlogsService,
    @Inject(CommentsService) private readonly commentService: CommentsService,
  ) {}

  @Get()
  async findPosts(@Query() queryDto: QueryType, @CurrentUser() currentUser) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.postsService.findPosts(queryFilters, null, currentUser?.userId);
  }

  // @UseGuards(BasicAuthGuard)
  // @Post()
  // async createPost(@Body() dto: PostDto) {
  //   const blog = await this.blogsService.findBlogById(dto.blogId);
  //   if (blog) {
  //     return await this.postsService.createPost(
  //       dto.title,
  //       dto.shortDescription,
  //       dto.content,
  //       dto.blogId,
  //       blog.name,
  //     );
  //   }
  //   throw new NotFoundException('Not Found');
  // }

  @Get('/:id')
  async findPostById(
    @Param() { id }: { id: string },
    @CurrentUser() currentUser,
  ) {
    return await this.postsService.findPostById(id, currentUser?.userId);
  }

  // @UseGuards(BasicAuthGuard)
  // @Put('/:id')
  // @HttpCode(204)
  // async updatePost(@Param() { id }: { id: string }, @Body() dto: PostDto) {
  //   await this.postsService.updatePost(id, dto);
  //   return;
  // }

  // @UseGuards(BasicAuthGuard)
  // @Delete('/:id')
  // @HttpCode(204)
  // async deletePost(@Param() { id }: { id: string }) {
  //   await this.postsService.deletePost(id);
  //   return;
  // }

  @Get('/:postId/comments')
  async getPostComments(
    @Param() { postId }: { postId: string },
    @Query() queryDto: QueryType,
    @CurrentUser() currentUser,
  ) {
    const post = await this.postsService.findPostById(
      postId,
      currentUser?.userId,
    );
    if (post) {
      const queryFilters = new QueryFilterModel(queryDto);
      return this.commentService.findPostComments(
        queryFilters,
        postId,
        currentUser?.userId,
      );
    }
    throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:postId/comments')
  async createComment(
    @Param() { postId }: { postId: string },
    @Body() dto: UpdateDto,
    @CurrentUser() currentUser,
  ) {
    return await this.commentService.createComment(
      postId,
      dto.content,
      currentUser?.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:postId/like-status')
  @HttpCode(204)
  async updatePostLikeStatus(
    @Param() { postId }: { postId: string },
    @Body() likeStatusDto: LikeStatusDto,
    @CurrentUser() currentUser,
  ) {
    await this.postsService.updatePostLikeStatus(
      postId,
      currentUser?.userId,
      likeStatusDto.likeStatus,
    );
    return;
  }
}
