import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BloggerService } from './blogger.service';
import { PostsService } from '../posts/posts.service';
import { CurrentUser } from '../decorators/current-user.param.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsBoolean, MinLength } from 'class-validator';
import { IsNotEmptyString } from '../decorators/isNotEmptyString';
import { QueryFilterModel, QueryType } from '../dto/queryFilter.model';

export class BanUnBanDto {
  @IsBoolean()
  isBanned: boolean;
  @IsNotEmptyString()
  @MinLength(20)
  banReason: string;
  @IsNotEmptyString()
  blogId: string;
}

@Controller('/blogger/users')
export class BloggerUsersController {
  constructor(
    private bloggerService: BloggerService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Put('/:id/ban')
  @HttpCode(204)
  banUnBanUser(
    @Body() banUnBanDto: BanUnBanDto,
    @CurrentUser() currentUser,
    @Param() { id },
  ) {
    return this.bloggerService.banUnBanUser(
      currentUser?.userId,
      id,
      banUnBanDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/blog/:blogId')
  async getBannedUsers(
    @Query() queryDto: QueryType,
    @Param() { blogId },
    @CurrentUser() currentUser,
  ) {
    await this.bloggerService.findBlogById(blogId, currentUser?.userId);
    const queryFilters = new QueryFilterModel(queryDto);
    return this.bloggerService.getBannedUsers(queryFilters, blogId);
  }
}
