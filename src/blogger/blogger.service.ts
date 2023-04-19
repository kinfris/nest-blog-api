import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDto, ReturnBlogModel } from './dto/blogger.dto';
import { IQueryFilter } from '../dto/queryFilter.model';
import { PaginationModel } from '../dto/pagination.model';
import { Blog, BlogDocument } from '../blogs/shemas/blogs.schema';
import { User, UserDocument } from '../users/shemas/users.schema';

@Injectable()
export class BloggerService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
}
