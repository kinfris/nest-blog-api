import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blogs.schema';
import mongoose, { Model } from 'mongoose';
import { BlogModel, ReturnBlogModel } from './models/blog.model';
import { IQueryFilter } from '../models/queryFilter.model';
import { PaginationModel } from '../models/pagination.model';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findBlogs(queryFilters: IQueryFilter) {
    try {
      const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
        queryFilters;
      const blogResponse = await this.blogModel
        .find()
        .where('name', { $regex: searchNameTerm, $options: 'i' })
        .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
        .skip(pageNumber * pageSize - pageSize)
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
    const newBlog = new BlogModel(name, description, websiteUrl);
    try {
      const blogResponse = await this.blogModel.create(newBlog);
      return new ReturnBlogModel(blogResponse);
    } catch (e) {
      console.log(e);
    }
  }

  async findBlogById(id: string) {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const blogResponse = await this.blogModel.findOne({ _id });
      if (blogResponse) {
        return new ReturnBlogModel(blogResponse);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
  ) {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const response = await this.blogModel.updateOne(
        { _id },
        { $set: { name, description, websiteUrl } },
      );
      return response.matchedCount === 1;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteBlog(id: string) {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const response = await this.blogModel.deleteOne({ _id });
      return response.deletedCount === 1;
    } catch (e) {
      console.log(e);
    }
  }
}
