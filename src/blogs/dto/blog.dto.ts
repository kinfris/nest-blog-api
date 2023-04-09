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

export class BlogDto {
  id = v4();
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;

  constructor(name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date();
    this.isMembership = false;
  }
}
