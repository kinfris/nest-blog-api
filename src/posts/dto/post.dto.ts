import { PostLikeStatusType } from '../schemas/postsLikes.schema';
import { v4 } from 'uuid';

export class ReturnPostModel {
  id;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: ExtendedLikesInfoType;

  constructor(postInfo, postLikes, userId) {
    this.id = postInfo.id;
    this.title = postInfo.title;
    this.shortDescription = postInfo.shortDescription;
    this.content = postInfo.content;
    this.blogId = postInfo.blogId;
    this.blogName = postInfo.blogName;
    this.createdAt = postInfo.createdAt;
    let userStatus: PostLikeStatusType;
    if (postLikes?.length > 0 && userId) {
      userStatus = postLikes.find((postLike) => userId === postLike.userId);
    }
    this.extendedLikesInfo = {
      likesCount: postLikes.filter((f) => f.likeStatus === 'Like').length,
      dislikesCount: postInfo.dislikesCount,
      myStatus: userStatus?.likeStatus ?? 'None',
      newestLikes: postLikes
        .filter((f) => f.likeStatus === 'Like')
        .splice(0, 3)
        .map((m) => ({
          addedAt: m.addedAt,
          userId: m.userId,
          login: m.userLogin,
        })),
    };
  }
}

export class PostEntity {
  id = v4();
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

type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: 'None' | 'Like' | 'Dislike';
  newestLikes: Array<{
    description: string;
    addedAt: Date;
    userId: string;
    login: string;
  }>;
};
