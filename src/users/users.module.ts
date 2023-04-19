import { Module } from '@nestjs/common';
import { UsersController } from './users.conroller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shemas/users.schema';
import { BcryptAdapter } from '../providers/bcryptAdapter';
import { Email, EmailSchema } from '../email/schemas/email.schema';
import { UserHashes, UserHashesSchema } from './shemas/userPassHashes.schema';
import { BanInfo, BanInfoSchema } from './shemas/banInfo.schema';
import { Device, DeviceSchema } from '../devices/schemas/devices.schema';
import { UserTokens, UserTokensSchema } from '../auth/shemas/userTokens.schema';

const schemas = [
  { name: User.name, schema: UserSchema },
  { name: UserHashes.name, schema: UserHashesSchema },
  { name: Email.name, schema: EmailSchema },
  { name: BanInfo.name, schema: BanInfoSchema },
  { name: Device.name, schema: DeviceSchema },
  { name: UserTokens.name, schema: UserTokensSchema },
];

@Module({
  imports: [MongooseModule.forFeature(schemas)],
  controllers: [UsersController],
  providers: [UsersService, BcryptAdapter],
  exports: [UsersService],
})
export class UsersModule {}
