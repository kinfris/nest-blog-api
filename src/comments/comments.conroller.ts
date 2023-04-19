import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';
import { CurrentUser } from '../decorators/current-user.param.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class UpdateDto {
  @MinLength(20)
  @MaxLength(300)
  content: string;
}

export class LikeStatusDto {
  @IsString()
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: 'None' | 'Like' | 'Dislike';
}

@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Get('/:id')
  async findCommentById(
    @Param() { id }: { id: string },
    @CurrentUser() currentUser,
  ) {
    const userId = currentUser?.userId || '';
    const comment = await this.commentService.findCommentById(id, userId);
    //if (!comment) throw new NotFoundException('Not Found');
    return comment;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:commentId/like-status')
  @HttpCode(204)
  async updateCommentLike(
    @Param() { commentId }: { commentId: string },
    @Body() likeStatusDto: LikeStatusDto,
    @CurrentUser() currentUser,
  ) {
    await this.commentService.changeLikeStatus(
      commentId,
      likeStatusDto.likeStatus,
      currentUser?.userId,
    );
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @HttpCode(204)
  async updateComment(
    @Param() { id }: { id: string },
    @Body() updateDto: UpdateDto,
    @CurrentUser() currentUser,
  ) {
    await this.commentService.updateComment(
      id,
      updateDto.content,
      currentUser?.userId,
    );
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteComment(
    @Param() { id }: { id: string },
    @CurrentUser() currentUser,
  ) {
    await this.commentService.deleteComment(id, currentUser?.userId);
    return;
  }
}
