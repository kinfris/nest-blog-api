import { v4 } from 'uuid';

export class CommentReturnDto {
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: Date;
  likesInfo: LikesInfoType;

  constructor(comment, likeStatus: LikeStatusType) {
    this.id = comment.id;
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
  id = v4();
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt = new Date();
  likesCount = 0;
  dislikesCount = 0;

  constructor(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ) {
    this.postId = postId;
    this.content = content;
    this.userId = userId;
    this.userLogin = userLogin;
  }
}

type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusType;
};

type LikeStatusType = 'None' | 'Like' | 'Dislike';
