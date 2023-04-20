import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestController } from './test.conroller';
import { TestService } from './test.service';
import { Post, PostSchema } from '../posts/schemas/posts.schema';
import { PostLikes, PostLikesSchema } from '../posts/schemas/postsLikes.schema';
import { Comment, CommentSchema } from '../comments/schemas/comments.schema';
import {
  CommentLikes,
  CommentLikesSchema,
} from '../comments/schemas/commentLikes.schema';
import { Blog, BlogSchema } from '../blogs/shemas/blogs.schema';
import { User, UserSchema } from '../users/shemas/users.schema';
import { Device, DeviceSchema } from '../devices/schemas/devices.schema';
import {
  UserHashes,
  UserHashesSchema,
} from '../users/shemas/userPassHashes.schema';
import { Email, EmailSchema } from '../email/schemas/email.schema';
import { UserTokens, UserTokensSchema } from '../auth/shemas/userTokens.schema';
import { BanInfo, BanInfoSchema } from '../users/shemas/banInfo.schema';
import { BlogBan, BlogBanSchema } from '../blogs/shemas/blogBan.schema';

const scheme = [
  { name: User.name, schema: UserSchema },
  { name: Post.name, schema: PostSchema },
  { name: PostLikes.name, schema: PostLikesSchema },
  { name: Comment.name, schema: CommentSchema },
  { name: CommentLikes.name, schema: CommentLikesSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: Device.name, schema: DeviceSchema },
  { name: UserHashes.name, schema: UserHashesSchema },
  { name: Email.name, schema: EmailSchema },
  { name: UserTokens.name, schema: UserTokensSchema },
  { name: UserTokens.name, schema: UserTokensSchema },
  { name: BanInfo.name, schema: BanInfoSchema },
  { name: BlogBan.name, schema: BlogBanSchema },
];

@Module({
  imports: [MongooseModule.forFeature(scheme)],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
