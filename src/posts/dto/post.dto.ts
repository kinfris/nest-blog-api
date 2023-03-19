import { PostLikeStatusType } from '../schemas/postsLikes.schema';

export class ReturnPostModel {
  id;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: ExtendedLikesInfoType;

  constructor(postInfo) {
    this.id = postInfo._id;
    this.title = postInfo.title;
    this.shortDescription = postInfo.shortDescription;
    this.content = postInfo.content;
    this.blogId = postInfo.blogId;
    this.blogName = postInfo.blogName;
    this.createdAt = postInfo.createdAt;
    let newestLikes = [];
    let userStatus: PostLikeStatusType;
    if (postInfo.postLikes) {
      userStatus = postInfo.postLikes.find(
        (postLike) => postInfo.userId === postLike.userId,
      );
      newestLikes = postInfo.postLikes.reverse().splice(0, 3);
    }
    this.extendedLikesInfo = {
      likesCount: postInfo.likesCount,
      dislikesCount: postInfo.dislikesCount,
      myStatus: userStatus?.likeStatus ?? 'None',
      newestLikes,
    };
  }
}

export class PostDto {
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
