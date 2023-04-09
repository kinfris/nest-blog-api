import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts/schemas/posts.schema';
import {
  PostLikes,
  PostLikesDocument,
} from '../posts/schemas/postsLikes.schema';
import { Comment, CommentDocument } from '../comments/schemas/comments.schema';
import {
  CommentLikes,
  CommentLikesDocument,
} from '../comments/schemas/commentLikes.schema';
import { Blog, BlogDocument } from '../blogs/shemas/blogs.schema';
import { User, UserDocument } from '../users/shemas/users.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(PostLikes.name)
    private postLikesModel: Model<PostLikesDocument>,
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(CommentLikes.name)
    private commentLikesModel: Model<CommentLikesDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async clearDb() {
    await this.userModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.postLikesModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.commentLikesModel.deleteMany({});
    await this.blogModel.deleteMany({});
  }
}
