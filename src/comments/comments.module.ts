import { Module } from '@nestjs/common';
import { CommentsController } from './comments.conroller';
import { CommentsService } from './comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comments.schema';
import {
  CommentLikes,
  CommentLikesSchema,
} from './schemas/commentLikes.schema';
import { User, UserSchema } from '../users/shemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: CommentLikes.name, schema: CommentLikesSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
