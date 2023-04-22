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
import { Device, DeviceDocument } from '../devices/schemas/devices.schema';
import {
  UserHashes,
  UserHashesDocument,
} from '../users/shemas/userPassHashes.schema';
import { Email, EmailDocument } from '../email/schemas/email.schema';
import {
  UserTokens,
  UserTokensDocument,
} from '../auth/shemas/userTokens.schema';
import { BanInfo, BanInfoDocument } from '../users/shemas/banInfo.schema';
import { BlogBan, BlogBanDocument } from '../blogs/shemas/blogBan.schema';
import { UsersBannedForBLog } from '../blogger/scheme/usrsBannedForBlog.schema';

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
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(UserHashes.name)
    private userHashesModel: Model<UserHashesDocument>,
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    @InjectModel(UserTokens.name)
    private userTokensModel: Model<UserTokensDocument>,
    @InjectModel(BanInfo.name)
    private banInfoModel: Model<BanInfoDocument>,
    @InjectModel(BlogBan.name)
    private blogBanModel: Model<BlogBanDocument>,
    @InjectModel(UsersBannedForBLog.name)
    private usersBannedForBLogModel: Model<UsersBannedForBLog>,
  ) {}

  async clearDb() {
    await this.userModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.postLikesModel.deleteMany({});
    await this.commentModel.deleteMany({});
    await this.commentLikesModel.deleteMany({});
    await this.blogModel.deleteMany({});
    await this.deviceModel.deleteMany({});
    await this.userHashesModel.deleteMany({});
    await this.emailModel.deleteMany({});
    await this.userTokensModel.deleteMany({});
    await this.banInfoModel.deleteMany({});
    await this.blogBanModel.deleteMany({});
    await this.usersBannedForBLogModel.deleteMany({});
  }
}
