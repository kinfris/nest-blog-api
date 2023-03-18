import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/posts.schema';
import { PostModel, ReturnPostModel } from './models/post.model';
import { IQueryFilter } from '../models/queryFilter.model';
import { PaginationModel } from '../models/pagination.model';
import { UpdatePostDto } from './posts.conroller';
import { PostLikes, PostLikesDocument } from './schemas/postsLikes.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(PostLikes.name)
    private postLikesModel: Model<PostLikesDocument>,
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
      .skip(pageNumber * pageSize - pageSize)
      .limit(pageSize)
      .exec();
    const posts = await Promise.all(
      postsResponse.map(async (post) => {
        const postLikes = await this.postLikesModel.find({ postId: post._id });
        return new ReturnPostModel({
          _id: post._id,
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
          likesCount: post.likesCount,
          dislikesCount: post.dislikesCount,
          postLikes,
        });
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
    const postModel = new PostModel(
      title,
      shortDescription,
      content,
      blogId,
      blogName,
    );
    const postResponse = await this.postModel.create(postModel);
    return new ReturnPostModel(postResponse);
  }

  async findPostById(id: string) {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const postResponse = await this.postModel.findOne({ _id });
      if (postResponse) {
        return new ReturnPostModel(postResponse);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async updatePost(id: string, dto: UpdatePostDto) {
    const _id = new mongoose.Types.ObjectId(id);
    const post = await this.postModel.findOne({ _id });
    if (post) {
      post.title = dto.title;
      post.shortDescription = dto.shortDescription;
      post.content = dto.content;
      post.blogId = dto.blogId;
      post.save();
    }
  }

  async deletePost(id: string) {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const deleteResponse = await this.postModel.deleteOne({ _id });
      console.log(deleteResponse);
      if (deleteResponse.deletedCount === 1) {
        await this.postLikesModel.deleteMany({
          postId: _id,
        });
        return true;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
