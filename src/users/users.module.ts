import { Module } from '@nestjs/common';
import { UsersController } from './users.conroller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shemas/users.schema';
import { BcryptAdapter } from '../providers/bcryptAdapter';
import { Email, EmailSchema } from '../email/schemas/email.schema';
import { UserHashes, UserHashesSchema } from './shemas/userPassHashes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserHashes.name, schema: UserHashesSchema },
    ]),
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, BcryptAdapter],
  exports: [UsersService],
})
export class UsersModule {}
