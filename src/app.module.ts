import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { TestModule } from './test/test.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { ExtractUserIdMiddleware } from './auth/middleware/extractUserId.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { IsBlogExistValidator } from './decorators/isBlogExist/isBlogExist.validator';
import { DevicesModule } from './devices/devices.module';
import { BloggerModule } from './blogger/blogger.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    BlogsModule,
    BloggerModule,
    PostsModule,
    UsersModule,
    CommentsModule,
    TestModule,
    AuthModule,
    EmailModule,
    DevicesModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_LOGIN, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ThrottlerGuard, IsBlogExistValidator],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractUserIdMiddleware)
      .forRoutes('*')
      .apply((req, res, next) => {
        // This middleware will be executed for all routes
        next();
      });
  }
}
