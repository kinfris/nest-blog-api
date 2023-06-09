import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BcryptAdapter } from '../providers/bcryptAdapter';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import process from 'process';
import { InjectModel } from '@nestjs/mongoose';
import { Email, EmailDocument } from '../email/schemas/email.schema';
import { EmailService } from '../email/email.service';
import { v4 } from 'uuid';
import {
  UserHashes,
  UserHashesDocument,
} from '../users/shemas/userPassHashes.schema';
import { UserTokens, UserTokensDocument } from './shemas/userTokens.schema';
import { Device, DeviceDocument } from '../devices/schemas/devices.schema';
import { BanInfo, BanInfoDocument } from '../users/shemas/banInfo.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private bcryptAdapter: BcryptAdapter,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    @InjectModel(UserHashes.name)
    private userHashesModel: Model<UserHashesDocument>,
    @InjectModel(UserTokens.name)
    private userTokensModel: Model<UserTokensDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(BanInfo.name) private banInfoModel: Model<BanInfoDocument>,
  ) {}

  async registration(login: string, password: string, email: string) {
    const { user, emailInfo } = await this.usersService.createUser(
      { login, email, password },
      false,
    );
    await this.emailService.sendConfirmation(
      emailInfo.email,
      emailInfo.confirmationCode,
    );

    return user;
  }

  async login(loginOrEmail: string, password, ip: string, userAgent: string) {
    const deviceId = v4();
    const user = await this.validateUser(loginOrEmail, password);
    const isUserBanned = await this.banInfoModel.findOne({
      userId: user.userId,
    });
    if (isUserBanned?.isBanned) throw new UnauthorizedException();
    const accessToken = await this.generateJwtToken(user.userId);
    const refreshToken = await this.generateRefreshToken({
      userId: user.userId,
      deviceId,
    });
    const refreshPayload = await this.verifyToken(refreshToken);
    const sessionEntity = {
      id: deviceId,
      ip,
      title: userAgent,
      userId: user.userId,
      createdAt: refreshPayload.iat,
      expiredAt: refreshPayload.exp,
      lastActiveDate: new Date(),
      refreshToken,
    };

    await this.deviceModel.create(sessionEntity);
    return { accessToken, refreshToken };
  }

  async validateUser(loginOrEmail: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUserNameOrEmail(loginOrEmail);
    if (user) {
      const isPassValid = await this.bcryptAdapter.checkPassword(
        pass,
        user?.passwordHash,
      );
      if (isPassValid) {
        const { passwordHash, ...result } = user;
        return { userId: result.id, userLogin: result.login };
      }
    }

    throw new UnauthorizedException();
  }

  generateJwtToken(userId: string) {
    const payload = { sub: userId };
    return this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: process.env.JWT_SECRET,
    });
  }

  generateRefreshToken({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }) {
    const payload = { sub: userId, deviceId };
    return this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret: process.env.JWT_SECRET,
    });
  }

  async registrationConfirmation(code: string) {
    const emailInfo = await this.emailModel.findOne({ confirmationCode: code });
    if (!emailInfo) {
      throw new BadRequestException({
        field: 'code',
        message: 'email with this code doesn`t exist',
      });
    }
    if (emailInfo.isConfirmed) {
      throw new BadRequestException({
        field: 'code',
        message: 'Email already confirmed',
      });
    }
    emailInfo.confirmationCode = code;
    emailInfo.isConfirmed = true;
    emailInfo.save();
    return;
  }

  async passwordRecovery(email: string) {
    const emailInfo = await this.emailModel.findOne({ email });
    if (emailInfo) {
      const recoveryCode = v4();
      await this.emailService.sendRecovery(email, recoveryCode);
      emailInfo.recoveryCode = recoveryCode;
      emailInfo.save();
    }
    return;
  }

  async createNewPassword(newPassword: string, recoveryCode: string) {
    const emailInfo = await this.emailModel.findOne({ recoveryCode });
    if (!emailInfo)
      throw new BadRequestException({
        field: 'email',
        message: 'email with this code doesn`t exist',
      });

    const user = await this.usersService.findByUserNameOrEmail(emailInfo.email);
    if (!user)
      throw new BadRequestException({
        field: 'email',
        message: 'user with this email doesn`t exist',
      });

    const userPassHashes = await this.userHashesModel.findOne({
      userId: user.id,
    });

    if (!userPassHashes) throw new BadRequestException();

    await this.bcryptAdapter.checkArrayOfPasswords(
      userPassHashes.passwordHashes,
      newPassword,
    );

    const newPasswordHash = await this.bcryptAdapter.generateHash(newPassword);
    user.passwordHash = newPasswordHash;
    user.save();
    userPassHashes.passwordHashes.push(newPasswordHash);
    userPassHashes.save();

    return;
  }

  async resendingCodeOnRegistration(email: string) {
    const emailInfo = await this.emailModel.findOne({ email });
    if (!emailInfo)
      throw new BadRequestException({ field: 'email', message: 'Wrong email' });
    if (emailInfo.isConfirmed)
      throw new BadRequestException({
        field: 'email',
        message: 'Email already confirmed',
      });
    const newConfirmationCode = v4();
    emailInfo.confirmationCode = newConfirmationCode;
    emailInfo.save();

    await this.emailService.sendConfirmation(email, newConfirmationCode);
    return;
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(refreshToken: string) {
    const { sub: userId, deviceId } = await this.verifyToken(refreshToken);
    const userTokens = await this.userTokensModel.findOne({ userId });
    const invalidTokens = userTokens?.invalidTokens || [];
    const isTokenAlreadyUsed = invalidTokens.find(
      (token) => token === refreshToken,
    );
    if (isTokenAlreadyUsed) throw new UnauthorizedException('invalid token');
    const accessToken = await this.generateJwtToken(userId);
    const newRefreshToken = await this.generateRefreshToken({
      userId,
      deviceId,
    });
    if (userTokens) {
      userTokens.invalidTokens.push(refreshToken);
      userTokens.save();
    } else {
      await this.userTokensModel.create({
        userId,
        invalidTokens: [refreshToken],
      });
    }

    const newRefreshTokenPayload = await this.verifyToken(newRefreshToken);
    const sessionInfo = await this.deviceModel.findOne({ id: deviceId });
    if (!sessionInfo) throw new NotFoundException();
    sessionInfo.lastActiveDate = new Date();
    sessionInfo.expiredAt = newRefreshTokenPayload.exp;
    sessionInfo.refreshToken = refreshToken;
    sessionInfo.save();
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, refreshToken: string, deviceId: string) {
    const userTokens = await this.userTokensModel.findOne({ userId });
    const isTokenAlreadyUsed = userTokens?.invalidTokens.find(
      (token) => token === refreshToken,
    );
    if (isTokenAlreadyUsed) throw new UnauthorizedException('invalid token');

    if (userTokens) {
      userTokens.invalidTokens.push(refreshToken);
      userTokens.save();
    } else {
      await this.userTokensModel.create({
        userId,
        invalidTokens: [refreshToken],
      });
    }

    const result = await this.deviceModel.deleteOne({ id: deviceId });
    if (result.deletedCount !== 1) throw new UnauthorizedException();
    return;
  }

  async getCurrentUserInfo(currentUserId: string) {
    const user = await this.usersService.findUserById(currentUserId);
    if (!user) throw new UnauthorizedException('Unauthorized');
    return { email: user.email, login: user.login, userId: user.id };
  }
}
