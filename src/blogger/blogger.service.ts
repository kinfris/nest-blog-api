import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDto, ReturnBlogModel } from './dto/blogger.dto';
import { IQueryFilter, QueryFilterModel } from '../dto/queryFilter.model';
import { PaginationModel } from '../dto/pagination.model';
import { Blog, BlogDocument } from '../blogs/shemas/blogs.schema';
import { User, UserDocument } from '../users/shemas/users.schema';
import { UsersBannedForBLog } from './scheme/usrsBannedForBlog.schema';
import { BanUnBanDto } from './bloggerUsers.conroller';

@Injectable()
export class BloggerService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UsersBannedForBLog.name)
    private usersBannedForBLogModel: Model<UsersBannedForBLog>,
  ) {}

  // async findBlogs(queryFilters: IQueryFilter) {
  //   try {
  //     const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
  //       queryFilters;
  //     const blogResponse = await this.blogModel
  //       .find({ name: { $regex: searchNameTerm, $options: 'i' } })
  //       .sort({ [sortBy]: sortDirection })
  //       .skip(pageNumber > 1 ? (pageNumber - 1) * pageSize : 0)
  //       .limit(pageSize)
  //       .lean();
  //     const blogs = blogResponse.map((blog) => new ReturnBlogModel(blog));
  //     const blogsCount = await this.blogModel
  //       .find()
  //       .where('name', { $regex: searchNameTerm, $options: 'i' })
  //       .countDocuments();
  //     const paginationInfo = new PaginationModel(
  //       pageNumber,
  //       pageSize,
  //       blogsCount,
  //     );
  //     return { ...paginationInfo, items: blogs };
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async findBlogsByBlogger(queryFilters: IQueryFilter, bloggerId: string) {
    try {
      const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
        queryFilters;
      const blogResponse = await this.blogModel
        .find({
          name: { $regex: searchNameTerm, $options: 'i' },
          bloggerId,
        })
        .sort({ [sortBy]: sortDirection })
        .skip(pageNumber > 1 ? (pageNumber - 1) * pageSize : 0)
        .limit(pageSize)
        .lean();
      const blogs = blogResponse.map((blog) => new ReturnBlogModel(blog));
      const blogsCount = await this.blogModel
        .find({
          name: { $regex: searchNameTerm, $options: 'i' },
          bloggerId,
        })
        .countDocuments();
      const paginationInfo = new PaginationModel(
        pageNumber,
        pageSize,
        blogsCount,
      );
      return { ...paginationInfo, items: blogs };
    } catch (e) {
      console.log(e);
    }
  }

  async createBlog(
    name: string,
    description: string,
    websiteUrl: string,
    userId: string,
  ) {
    const user = await this.userModel.findOne({ id: userId });
    if (!user) throw new UnauthorizedException();
    const newBlog = new BlogDto(
      name,
      description,
      websiteUrl,
      userId,
      user.login,
    );
    const blogResponse = await this.blogModel.create(newBlog);
    return new ReturnBlogModel(blogResponse);
  }

  async findBlogById(id: string) {
    const blogResponse = await this.blogModel.findOne({ id });
    if (blogResponse) {
      return new ReturnBlogModel(blogResponse);
    }
    throw new NotFoundException('Not found');
  }

  async isBlogByExist(id: string) {
    const blogResponse = await this.blogModel.findOne({ id }).lean();
    if (!blogResponse) throw new NotFoundException();
    return blogResponse;
  }

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    userId: string,
  ) {
    const blog = await this.blogModel.findOne({ id });
    if (!blog) throw new NotFoundException('Not found');
    if (blog?.bloggerId !== userId) throw new ForbiddenException();
    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    blog.save();
    return;
  }

  async deleteBlog(id: string, userId: string) {
    const blog = await this.blogModel.findOne({ id });
    if (!blog) throw new NotFoundException();
    if (blog?.bloggerId !== userId) throw new ForbiddenException();
    const response = await this.blogModel.deleteOne({ id });
    if (response.deletedCount !== 1) throw new NotFoundException('Not found');
    return;
  }

  async banUnBanUser(
    ownerUserId: string,
    banUserId: string,
    { blogId, isBanned, banReason }: BanUnBanDto,
  ) {
    const blog = await this.blogModel.findOne({ id: blogId }).lean();
    if (blog?.bloggerId !== ownerUserId) throw new ForbiddenException();

    const banInfo = await this.usersBannedForBLogModel.findOne({
      userId: banUserId,
    });
    if (!isBanned) {
      if (!banInfo) throw new NotFoundException();
      banInfo.banReason = null;
      banInfo.banDate = null;
      banInfo.isBanned = false;
      banInfo.save();
      return;
    }
    if (banInfo) {
      banInfo.banReason = banReason;
      banInfo.banDate = new Date();
      banInfo.isBanned = true;
      banInfo.save();
    } else {
      const userInfo = await this.userModel.findOne({ id: banUserId }).lean();
      if (!userInfo) throw new NotFoundException();
      const banInfoEntity = {
        blogId,
        userId: banUserId,
        userLogin: userInfo.login,
        isBanned: true,
        banReason,
        banDate: new Date(),
      };
      await this.usersBannedForBLogModel.create(banInfoEntity);
    }

    return;
  }

  async getBannedUsers(queryFilters: QueryFilterModel, blogId: string) {
    const { pageNumber, pageSize, searchLoginTerm, sortBy, sortDirection } =
      queryFilters;
    const bannedUsersForBlog = await this.usersBannedForBLogModel
      .find({
        blogId,
        userLogin: { $regex: searchLoginTerm, $options: 'i' },
      })
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 1 ? (pageNumber - 1) * pageSize : 0)
      .limit(pageSize)
      .lean();

    const bannedUsersCount = await this.usersBannedForBLogModel
      .find({
        blogId,
        userLogin: { $regex: searchLoginTerm, $options: 'i' },
      })
      .countDocuments();

    const paginationInfo = new PaginationModel(
      pageNumber,
      pageSize,
      bannedUsersCount,
    );
    return {
      ...paginationInfo,
      items: bannedUsersForBlog.map((m) => ({
        id: m.userId,
        login: m.userLogin,
        banInfo: {
          isBanned: m.isBanned,
          banDate: m.banDate,
          banReason: m.banReason,
        },
      })),
    };
  }
}
