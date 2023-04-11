import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { QueryFilterModel, QueryType } from '../dto/queryFilter.model';
import { BasicAuthGuard } from '../auth/guards/basic-auth.guard';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @MaxLength(10)
  login: string;
  @MinLength(6)
  @MaxLength(20)
  password: string;
  @IsEmail()
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const { user } = await this.usersService.createUser(dto);
    return user;
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  findUsers(@Query() queryDto: QueryType) {
    const queryFilters = new QueryFilterModel(queryDto);
    return this.usersService.findUsers(queryFilters);
  }

  @UseGuards(BasicAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteUser(@Param() { id }: { id: string }) {
    await this.usersService.deleteUser(id);
  }
}
