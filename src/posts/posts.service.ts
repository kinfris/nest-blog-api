import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/posts.schema';
import { PostEntity, ReturnPostModel } from './dto/post.dto';
import { IQueryFilter } from '../dto/queryFilter.model';
import { PaginationModel } from '../dto/pagination.model';
import { PostDto } from './posts.conroller';
import { PostLikes, PostLikesDocument } from './schemas/postsLikes.schema';
import { Comment, CommentDocument } from '../comments/schemas/comments.schema';
import {
  CommentLikes,
  CommentLikesDocument,
} from '../comments/schemas/commentLikes.schema';
import { likesDislikesCountCalculation } from '../helpers/likesDieslikesCount';
import { v4 } from 'uuid';
import { User, UserDocument } from '../users/shemas/users.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(PostLikes.name)
    private postLikesModel: Model<PostLikesDocument>,
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(CommentLikes.name)
    private commentLikesModel: Model<CommentLikesDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findPosts(queryFilters: IQueryFilter, blogId?: string) {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryFilters;
    const filter: { blogId?: string } = {};
    if (blogId) {
      filter.blogId = blogId;
    }
    const postsResponse = await this.postModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageNumber > 0 ? (pageNumber - 1) * pageSize : 0)
      .limit(pageSize)
      .exec();
    const posts = await Promise.all(
      postsResponse.map(async (post) => {
        const postLikes = await this.postLikesModel
          .find({ postId: post.id })
          .sort({ _id: -1 })
          .limit(3);
        return new ReturnPostModel(
          {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
          },
          postLikes,
        );
      }),
    );
    const postsCount = await this.postModel.find(filter).countDocuments();
    const paginationInfo = new PaginationModel(
      pageNumber,
      pageSize,
      postsCount,
    );
    return { ...paginationInfo, items: posts };
  }

  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
  ) {
    const postModel = new PostEntity(
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    );
    const postResponse = await this.postModel.create(postModel);
    return new ReturnPostModel(postResponse, []);
  }

  async findPostById(id: string) {
    const postResponse = await this.postModel.findOne({ id });
    if (postResponse) {
      const postLikes = await this.postLikesModel
        .find({ postId: id })
        .sort({ _id: -1 })
        .limit(3)
        .lean();
      return new ReturnPostModel(postResponse, postLikes);
    }
    throw new NotFoundException('Not found');
  }

  async updatePost(id: string, dto: PostDto) {
    const post = await this.postModel.findOne({ id });
    if (post) {
      post.title = dto.title;
      post.shortDescription = dto.shortDescription;
      post.content = dto.content;
      post.blogId = dto.blogId;
      post.save();
      return;
    }
    throw new NotFoundException('Not Found');
  }

  async deletePost(id: string) {
    const deleteResponse = await this.postModel.deleteOne({ id });
    if (deleteResponse.deletedCount !== 1) {
      throw new NotFoundException('Not found');
    }

    await this.postLikesModel.deleteMany({
      postId: id,
    });
    await this.commentModel.deleteMany({ postId: id });
    await this.commentLikesModel.deleteMany({ postId: id });

    return;
  }

  async updatePostLikeStatus(
    postId: string,
    userId,
    likeStatus: 'None' | 'Like' | 'Dislike',
  ) {
    const post = await this.postModel.findOne({ id: postId });
    if (!post) throw new NotFoundException('Not found');

    const postUserLike = await this.postLikesModel.findOne({
      postId,
      userId,
    });

    if (!postUserLike) {
      const user = await this.userModel.findOne({ id: userId });
      const newUserPostLikeEntity = {
        id: v4(),
        postId: postId,
        addedAt: new Date(),
        userId,
        userLogin: user.login,
        blogId: post.blogId,
        likeStatus,
      };
      await this.postLikesModel.create(newUserPostLikeEntity);
      if (likeStatus === 'Dislike') {
        post.dislikesCount += 1;
      } else {
        post.likesCount += likeStatus === 'Like' ? 1 : 0;
      }
      post.save();
      return;
    }
    const likeOrDislikeCount = likesDislikesCountCalculation(
      likeStatus,
      postUserLike.likeStatus,
    );

    postUserLike.likeStatus = likeStatus;
    postUserLike.save();

    post.dislikesCount += likeOrDislikeCount.dislike;
    post.likesCount += likeOrDislikeCount.like;
    post.save();

    return;
  }
}
