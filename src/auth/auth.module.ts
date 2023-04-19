import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptAdapter } from '../providers/bcryptAdapter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { BasicStrategy } from './strategies/basic.strategy';
import { EmailModule } from '../email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from '../email/schemas/email.schema';
import {
  UserHashes,
  UserHashesSchema,
} from '../users/shemas/userPassHashes.schema';
import { UserTokens, UserTokensSchema } from './shemas/userTokens.schema';
import { Device, DeviceSchema } from '../devices/schemas/devices.schema';
import { BanInfo, BanInfoSchema } from '../users/shemas/banInfo.schema';

const schemas = [
  { name: Email.name, schema: EmailSchema },
  { name: UserHashes.name, schema: UserHashesSchema },
  { name: UserTokens.name, schema: UserTokensSchema },
  { name: Device.name, schema: DeviceSchema },
  { name: BanInfo.name, schema: BanInfoSchema },
];

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forFeature(schemas),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptAdapter,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
  ],
})
export class AuthModule {}
