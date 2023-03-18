import { Controller, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Get('/:id')
  findCommentById(@Param() { id }: { id: string }) {
    return this.commentService.findCommentById(id);
  }
}
