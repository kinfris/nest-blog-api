import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Get('/:id')
  async findCommentById(@Param() { id }: { id: string }) {
    const comment = await this.commentService.findCommentById(id);
    if (comment) {
      return comment;
    }
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }
}
