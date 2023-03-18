export class ReturnBlogModel {
  id;
  name;
  description;
  websiteUrl;
  createdAt;
  isMembership;
  constructor(blog) {
    this.id = blog._id;
    this.name = blog.name;
    this.description = blog.description;
    this.websiteUrl = blog.websiteUrl;
    this.createdAt = blog.createdAt;
    this.isMembership = blog.isMembership;
  }
}
export class BlogModel {
  name;
  description;
  websiteUrl;
  createdAt;
  isMembership;
  constructor(name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date();
    this.isMembership = true;
  }
}
