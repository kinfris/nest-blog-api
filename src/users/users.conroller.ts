import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryFilterModel, QueryType } from '../dto/queryFilter.model';

export type CreateUserDto = {
  login: string;
  password: string;
  email: string;
};

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  findUsers(@Query() queryDto: QueryType) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.usersService.findUsers(queryFilters);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param() { id }: { id: string }) {
    const isDeleted = await this.usersService.deleteUser(id);
    if (isDeleted) {
      return;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
