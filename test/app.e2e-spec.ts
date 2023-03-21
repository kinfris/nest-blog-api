import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await request(app.getHttpServer()).delete('/testing/all-data');
  });
  afterEach(async () => {
    await request(app.getHttpServer()).delete('/testing/all-data');
  });
  it(' Should return blog by id (GET) /blogs/:blogId (Additional method (POST) /blogs)', async () => {
    const createDto = {
      name: 'New blog 1',
      description: 'blog description',
      websiteUrl:
        'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
    };
    const blogResponse = await request(app.getHttpServer())
      .post('/blogs')
      .send(createDto);
    const blog = blogResponse.body;
    return request(app.getHttpServer())
      .get(`/blogs/${blog.id}`)
      .expect(200)
      .expect({
        id: blog.id,
        name: 'New blog 1',
        description: 'blog description',
        websiteUrl:
          'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
        createdAt: blog.createdAt,
        isMembership: false,
      });
  });

  it('Should return all blogs (GET) /blogs ', async () => {
    const createDto1 = {
      name: 'New blog 1',
      description: 'blog description',
      websiteUrl:
        'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
    };

    const createDto2 = {
      name: 'New blog 2',
      description: 'blog description',
      websiteUrl:
        'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
    };
    const blogs: any = {};
    for (let i = 0; i < 10; i++) {
      const { body } = await request(app.getHttpServer())
        .post('/blogs')
        .send(createDto1);
      blogs[`blog${i}`] = body;
    }
    const { body: blog2 } = await request(app.getHttpServer())
      .post('/blogs')
      .send(createDto2);

    return request(app.getHttpServer())
      .get('/blogs')
      .expect(200)
      .expect({
        pagesCount: 2,
        page: 1,
        pageSize: 10,
        totalCount: 11,
        items: [
          {
            id: blog2.id,
            name: blog2.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blog2.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog9.id,
            name: blogs.blog9.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog9.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog8.id,
            name: blogs.blog8.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog8.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog7.id,
            name: blogs.blog7.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog7.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog6.id,
            name: blogs.blog6.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog6.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog5.id,
            name: blogs.blog5.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog5.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog4.id,
            name: blogs.blog4.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog4.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog3.id,
            name: blogs.blog3.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog3.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog2.id,
            name: blogs.blog2.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog2.createdAt,
            isMembership: false,
          },
          {
            id: blogs.blog1.id,
            name: blogs.blog1.name,
            description: 'blog description',
            websiteUrl:
              'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
            createdAt: blogs.blog1.createdAt,
            isMembership: false,
          },
        ],
      });
  });

  it('Should update blog by id (PUT) /blogs/:blogId (Additional method (POST) /blogs, (GET) /blogs/:blogId)', async () => {
    const createDto = {
      name: 'New blog 1',
      description: 'blog description',
      websiteUrl:
        'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
    };
    const updateDto = {
      name: 'New blog 1 (updated)',
      description: 'blog description (updated)',
      websiteUrl: 'https://www.youtube.com/ (updated)',
    };
    const { body: blog } = await request(app.getHttpServer())
      .post('/blogs')
      .send(createDto);
    return request(app.getHttpServer())
      .put(`/blogs/${blog.id}`)
      .send(updateDto)
      .expect(204);
  });

  it(
    'Should create blog`s post (POST) /blogs/:blogId/posts' +
      ' (Additional method (POST) /blogs, (GET) /posts/:postId )',
    async () => {
      const createBlogDto = {
        name: 'New blog 1',
        description: 'blog description',
        websiteUrl:
          'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
      };
      const createPostDto = {
        title: 'new post',
        shortDescription: 'post short description',
        content: 'post content',
      };
      const { body: blog } = await request(app.getHttpServer())
        .post('/blogs')
        .send(createBlogDto);
      const { body: post } = await request(app.getHttpServer())
        .post(`/blogs/${blog.id}/posts`)
        .send(createPostDto);

      return request(app.getHttpServer())
        .get(`/posts/${post.id}`)
        .expect(200)
        .expect({
          id: post.id,
          title: 'new post',
          shortDescription: 'post short description',
          content: 'post content',
          blogId: blog.id,
          blogName: blog.name,
          createdAt: post.createdAt,
          extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
          },
        });
    },
  );

  it(
    'Should return all blog`s posts (Get) /blogs/:blogId/posts' +
      ' (Additional method (POST) /blogs, (POST) /blogs/:blogId/posts)',
    async () => {
      const createBlogDto = {
        name: 'New blog 1',
        description: 'blog description',
        websiteUrl:
          'https://www.youtube.com/watch?v=vuzKKCYXISA&ab_channel=IT-KAMASUTRA',
      };
      const createPostDto = {
        title: 'new post',
        shortDescription: 'post short description',
        content: 'post content',
      };
      const { body: blog } = await request(app.getHttpServer())
        .post('/blogs')
        .send(createBlogDto);
      const posts: any = [];
      for (let i = 0; i < 10; i++) {
        const { body } = await request(app.getHttpServer())
          .post(`/blogs/${blog.id}/posts`)
          .send(createPostDto);
        posts.push(body);
      }
      posts.reverse();
      return request(app.getHttpServer())
        .get(`/blogs/${blog.id}/posts`)
        .expect(200)
        .expect({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 10,
          items: [...posts],
        });
    },
  );
});
