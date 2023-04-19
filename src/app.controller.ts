import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs/blogs.service';
import { QueryFilterModel, QueryType } from './dto/queryFilter.model';
import { BasicAuthGuard } from './auth/guards/basic-auth.guard';

@Controller()
export class AppController {
  constructor(private blogService: BlogsService) {}

  @Get()
  testRout() {
    return 'Hello World!';
  }

  @UseGuards(BasicAuthGuard)
  @Get('/sa/blogs')
  findBlogsForSa(@Query() queryDto: QueryType) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.blogService.findBlogsForSa(queryFilters);
  }
}
