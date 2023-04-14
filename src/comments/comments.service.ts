import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDto, CommentReturnDto } from './dto/comment.dto';
import { IQueryFilter } from '../dto/queryFilter.model';
import {
  CommentLikes,
  CommentLikesDocument,
  LikeStatusType,
} from './schemas/commentLikes.schema';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { PaginationModel } from '../dto/pagination.model';
import { User, UserDocument } from '../users/shemas/users.schema';
import { likesDislikesCountCalculation } from '../helpers/likesDieslikesCount';
import { v4 } from 'uuid';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(CommentLikes.name)
    private commentLikesModel: Model<CommentLikesDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findCommentById(id: string, userId = '') {
    const comment = await this.commentModel.findOne({ id }).lean();
    if (comment) {
      let commentLike: any = {};
      if (userId) {
        commentLike = await this.commentLikesModel.findOne({
          commentId: id,
          userId,
        });
      }
      const likeStatus = commentLike?.likeStatus ?? 'None';
      return new CommentReturnDto(comment, likeStatus);
    }
  }

  async findPostComments(
    queryFilters: IQueryFilter,
    postId: string,
    userId = '',
  ) {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryFilters;
    const commentsResponse = await this.commentModel
      .find({ postId })
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageNumber > 0 ? (pageNumber - 1) * pageSize : 0)
      .limit(pageSize)
      .lean();
    const comments = await Promise.all(
      commentsResponse.map(async (comment) => {
        const commentLike = await this.commentLikesModel
          .findOne({
            userId: userId,
            commentId: comment.id,
          })
          .lean();
        const likeStatus = commentLike?.likeStatus ?? 'None';
        return new CommentReturnDto(comment, likeStatus);
      }),
    );
    const countPostComments = await this.commentModel
      .find({ postId })
      .countDocuments();
    const paginationInfo = new PaginationModel(
      pageNumber,
      pageSize,
      countPostComments,
    );
    return { ...paginationInfo, items: comments };
  }

  async updateComment(id: string, newContent: string) {
    try {
      const comment = await this.commentModel.findOne({ id });
      if (comment) {
        comment.content = newContent;
        comment.save();
        return;
      }
    } catch (e) {
      throw new NotFoundException('Not Found');
    }
  }

  async createComment(postId: string, content: string, userId: string) {
    try {
      const user = await this.userModel.findOne({ id: userId }).lean();
      const commentDto = new CommentDto(postId, content, userId, user.login);
      const newComment = await this.commentModel.create(commentDto);
      return new CommentReturnDto(newComment, 'None');
    } catch (e) {
      throw new NotFoundException('Not Found');
    }
  }

  async changeLikeStatus(
    commentId: string,
    likeStatus: LikeStatusType,
    userId,
  ) {
    const userCommentLike = await this.commentLikesModel.findOne({
      userId,
      commentId,
    });
    const comment = await this.commentModel.findOne({ id: commentId });
    if (!comment) throw new NotFoundException('Not Found');
    if (!userCommentLike) {
      const newUserCommentLikeEntity = {
        id: v4(),
        commentId: commentId,
        addedAt: new Date(),
        userId: userId,
        likeStatus,
        postId: comment.postId,
      };
      await this.commentLikesModel.create(newUserCommentLikeEntity);
      if (likeStatus === 'Dislike') {
        comment.dislikesCount += 1;
      } else {
        comment.likesCount += likeStatus === 'Like' ? 1 : 0;
      }
      comment.save();
      return;
    }

    const likeOrDislikeCount = likesDislikesCountCalculation(
      likeStatus,
      userCommentLike.likeStatus,
    );

    userCommentLike.likeStatus = likeStatus;
    userCommentLike.save();

    comment.dislikesCount += likeOrDislikeCount.dislike;
    comment.likesCount += likeOrDislikeCount.like;
    comment.save();
    return;
  }

  async deleteComment(id: string, userId: string | null) {
    const result = await this.commentModel.findOne({ id });
    if (!result) throw new NotFoundException('Not found');
    if (!userId || result?.userId !== userId)
      throw new ForbiddenException('Don`t have permission for this');
    await this.commentLikesModel.deleteMany({ commentId: id });
    await this.commentModel.deleteOne({ id });
    return;
  }
}
