import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryFilterModel, QueryType } from '../models/queryFilter.model';

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
  deleteUser(@Param() { id }: { id: string }) {
    return this.usersService.deleteUser(id);
  }
}
