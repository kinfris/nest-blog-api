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
import { BlogsService } from './blogs.service';
import { QueryFilterModel, QueryType } from '../dto/queryFilter.model';
import { PostsService } from '../posts/posts.service';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { IsBoolean } from 'class-validator';

class IsBanDto {
  @IsBoolean()
  isBanned: boolean;
}

@Controller('sa/blogs')
export class SaBlogsController {
  constructor(
    private blogService: BlogsService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get('')
  findBlogsForSa(@Query() queryDto: QueryType) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.blogService.findBlogsForSa(queryFilters);
  }

  @UseGuards(BasicAuthGuard)
  @Put('/:id/ban')
  @HttpCode(204)
  banUnBanBlog(@Param() { id }: { id: string }, @Body() dto: IsBanDto) {
    return this.blogService.banUnBanBlog(id, dto.isBanned);
  }
}
