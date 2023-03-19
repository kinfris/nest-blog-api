import { Module } from '@nestjs/common';
import { UsersController } from './users.conroller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { BcryptAdapter } from '../providers/bcryptAdapter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, BcryptAdapter],
  exports: [UsersService],
})
export class UsersModule {}
