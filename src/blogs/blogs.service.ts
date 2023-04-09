import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './shemas/blogs.schema';
import { Model } from 'mongoose';
import { BlogDto, ReturnBlogModel } from './dto/blog.dto';
import { IQueryFilter } from '../dto/queryFilter.model';
import { PaginationModel } from '../dto/pagination.model';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findBlogs(queryFilters: IQueryFilter) {
    try {
      const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
        queryFilters;
      const blogResponse = await this.blogModel
        .find({ name: { $regex: searchNameTerm, $options: 'i' } })
        .sort({ [sortBy]: sortDirection })
        .skip(pageNumber > 1 ? (pageNumber - 1) * pageSize : 0)
        .limit(pageSize)
        .lean();
      const blogs = blogResponse.map((blog) => new ReturnBlogModel(blog));
      const blogsCount = await this.blogModel
        .find()
        .where('name', { $regex: searchNameTerm, $options: 'i' })
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

  async createBlog(name: string, description: string, websiteUrl: string) {
    const newBlog = new BlogDto(name, description, websiteUrl);
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

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ) {
    const blog = await this.blogModel.findOne({ id });
    if (blog) {
      blog.name = name;
      blog.description = description;
      blog.websiteUrl = websiteUrl;
      blog.save();
      return;
    }
    throw new NotFoundException('Not found');
  }

  async deleteBlog(id: string) {
    const response = await this.blogModel.deleteOne({ id });
    if (response.deletedCount !== 1) throw new NotFoundException('Not found');
    return;
  }
}
