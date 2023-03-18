import { ObjectId } from 'mongoose';
import { IComment } from '../schemas/comments.schema';

export class CommentReturnDto {
  id: ObjectId;
  content: string;
  commentatorInfo: { userId: ObjectId; userLogin: string };
  createdAt: Date;
  likesInfo: LikesInfoType;

  constructor(comment: IComment, likeStatus: LikeStatusType) {
    this.id = comment._id;
    this.content = comment.content;
    this.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    this.createdAt = comment.createdAt;
    this.likesInfo = {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: likeStatus,
    };
  }
}

//Still no use
export class CommentDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  likesCount = 0;
  dislikesCount = 0;

  constructor(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = new Date();
  }
}

type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusType;
};

type LikeStatusType = 'None' | 'Like' | 'Dislike';
