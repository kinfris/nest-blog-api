import { v4 } from 'uuid';

export class ReturnBlogModel {
  id;
  name;
  description;
  websiteUrl;
  createdAt;
  isMembership;

  constructor(blog) {
    this.id = blog.id;
    this.name = blog.name;
    this.description = blog.description;
    this.websiteUrl = blog.websiteUrl;
    this.createdAt = blog.createdAt;
    this.isMembership = blog.isMembership;
  }
}

export class ReturnBlogModelForSA {
  id;
  name;
  description;
  websiteUrl;
  createdAt;
  isMembership;
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };

  constructor(blog) {
    this.id = blog.id;
    this.name = blog.name;
    this.description = blog.description;
    this.websiteUrl = blog.websiteUrl;
    this.createdAt = blog.createdAt;
    this.isMembership = blog.isMembership;
    this.blogOwnerInfo = {
      userId: blog.bloggerId,
      userLogin: blog.bloggerLogin,
    };
  }
}
