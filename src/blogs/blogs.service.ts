import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './shemas/blogs.schema';
import { Model } from 'mongoose';
import { ReturnBlogModel, ReturnBlogModelForSA } from './dto/blog.dto';
import { QueryFilterModel } from '../dto/queryFilter.model';
import { PaginationModel } from '../dto/pagination.model';
import { BlogBan, BlogBanDocument } from './shemas/blogBan.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(BlogBan.name)
    private blogBanModel: Model<BlogBanDocument>,
  ) {}

  async findBlogs(queryFilters: QueryFilterModel) {
    const { blogResponse, ...paginationInfo } = await this.findBlogsWithPaging(
      queryFilters,
    );
    const blogs = blogResponse.map((blog) => new ReturnBlogModel(blog));
    return { ...paginationInfo, items: blogs };
  }

  // async createBlog(name: string, description: string, websiteUrl: string) {
  //   const newBlog = new BlogDto(name, description, websiteUrl);
  //   const blogResponse = await this.blogModel.create(newBlog);
  //   return new ReturnBlogModel(blogResponse);
  // }

  async findBlogById(id: string) {
    const blogResponse = await this.blogModel.findOne({ id });
    if (blogResponse) {
      return new ReturnBlogModel(blogResponse);
    }
    throw new NotFoundException('Not found');
  }

  //
  // async updateBlog(
  //   id: string,
  //   name: string,
  //   description: string,
  //   websiteUrl: string,
  // ) {
  //   const blog = await this.blogModel.findOne({ id });
  //   if (blog) {
  //     blog.name = name;
  //     blog.description = description;
  //     blog.websiteUrl = websiteUrl;
  //     blog.save();
  //     return;
  //   }
  //   throw new NotFoundException('Not found');
  // }
  //
  // async deleteBlog(id: string) {
  //   const response = await this.blogModel.deleteOne({ id });
  //   if (response.deletedCount !== 1) throw new NotFoundException('Not found');
  //   return;
  // }
  async findBlogsForSa(queryFilters: QueryFilterModel) {
    const { blogResponse, ...paginationInfo } = await this.findBlogsWithPaging(
      queryFilters,
    );
    const blogsWithBanInfo = Promise.all(
      blogResponse.map(async (blog) => {
        const banInfo = await this.blogBanModel
          .findOne({ blogId: blog.id })
          .lean();
        return new ReturnBlogModelForSA(blog, banInfo);
      }),
    );
    return { ...paginationInfo, items: blogsWithBanInfo };
  }

  async findBlogsWithPaging(queryFilters: QueryFilterModel) {
    const { pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } =
      queryFilters;
    const blogResponse = await this.blogModel
      .find({ name: { $regex: searchNameTerm, $options: 'i' } })
      .sort({ [sortBy]: sortDirection })
      .skip(pageNumber > 1 ? (pageNumber - 1) * pageSize : 0)
      .limit(pageSize)
      .lean();

    const blogsCount = await this.blogModel
      .find()
      .where('name', { $regex: searchNameTerm, $options: 'i' })
      .countDocuments();
    const paginationInfo = new PaginationModel(
      pageNumber,
      pageSize,
      blogsCount,
    );
    return { ...paginationInfo, blogResponse };
  }

  async banUnBanBlog(blogId: string, isBanned: boolean) {
    const banInfo = await this.blogBanModel.findOne({ blogId });
    if (!isBanned) {
      if (!banInfo) throw new NotFoundException();
      banInfo.banDate = null;
      banInfo.isBanned = false;
      banInfo.save();
      return;
    }
    if (banInfo) {
      banInfo.isBanned = true;
      banInfo.banDate = new Date();
      banInfo.save();
    } else {
      const banInfoEntity = {
        blogId,
        isBanned: true,
        banDate: new Date(),
      };
      await this.blogBanModel.create(banInfoEntity);
    }
    return;
  }
}
