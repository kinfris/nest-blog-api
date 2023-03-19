import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommentReturnDto } from './dto/comment.dto';
import { IQueryFilter } from '../dto/queryFilter.model';
import {
  CommentLikes,
  CommentLikesDocument,
} from './schemas/commentLikes.schema';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { PaginationModel } from '../dto/pagination.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(CommentLikes.name)
    private commentLikesModel: Model<CommentLikesDocument>,
  ) {}

  async findCommentById(id: string, userId = '') {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const comment = await this.commentModel.findOne({ _id }).lean();
      if (comment) {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const commentLike = await this.commentLikesModel
          .findOne({
            commentId: _id,
            userId: userObjectId,
          })
          .lean();
        const likeStatus = commentLike.likeStatus ?? 'None';
        return new CommentReturnDto(comment, likeStatus);
      }
      return null;
    } catch (e) {
      console.log(e);
    }
  }

  async findPostComments(
    queryFilters: IQueryFilter,
    postId: string,
    userId = '',
  ) {
    try {
      const { pageNumber, pageSize, sortBy, sortDirection } = queryFilters;
      const postObjectId = new mongoose.Types.ObjectId(postId);
      const commentsResponse = await this.commentModel
        .find({ postId: postObjectId })
        .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
        .skip(pageNumber * pageSize - pageSize)
        .limit(pageSize)
        .lean();
      const comments = await Promise.all(
        commentsResponse.map(async (comment) => {
          const commentLike = await this.commentLikesModel
            .findOne({
              userId: userId,
              commentId: comment._id,
            })
            .lean();
          const likeStatus = commentLike.likeStatus ?? 'None';
          return new CommentReturnDto(comment, likeStatus);
        }),
      );
      const countPostComments = await this.commentModel
        .find({ postId: postObjectId })
        .countDocuments();
      const paginationInfo = new PaginationModel(
        pageNumber,
        pageSize,
        countPostComments,
      );
      return { ...paginationInfo, items: comments };
    } catch (e) {
      console.log(e);
    }
  }
}
