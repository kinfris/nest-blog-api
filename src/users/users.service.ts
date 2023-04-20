import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './shemas/users.schema';
import { CreateUserDto } from './users.conroller';
import { BcryptAdapter } from '../providers/bcryptAdapter';
import { ReturnUserDto } from './dto/user.dto';
import { IQueryFilter } from '../dto/queryFilter.model';
import { PaginationModel } from '../dto/pagination.model';
import { EmailCreateDto } from '../email/dto/email.dto';
import { Email, EmailDocument } from '../email/schemas/email.schema';
import { UserHashes, UserHashesDocument } from './shemas/userPassHashes.schema';
import { v4 } from 'uuid';
import { Device, DeviceDocument } from '../devices/schemas/devices.schema';
import {
  UserTokens,
  UserTokensDocument,
} from '../auth/shemas/userTokens.schema';
import { BanInfo, BanInfoDocument } from './shemas/banInfo.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserHashes.name)
    private userHashesModel: Model<UserHashesDocument>,
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
    private bcryptAdapter: BcryptAdapter,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(UserTokens.name)
    private userTokensModel: Model<UserTokensDocument>,
    @InjectModel(BanInfo.name) private banInfoModel: Model<BanInfoDocument>,
  ) {}

  async findUserById(id: string) {
    return this.userModel.findOne({ id });
  }

  async createUser(dto: CreateUserDto, isEmailConfirmed = true) {
    const isUserWithThisLoginOrEmailExist = await this.userModel
      .findOne(
        { $or: [{ login: dto.login }, { email: dto.email }] },
        {
          _id: 0,
          login: 1,
          email: 1,
          matchedField: {
            $cond: [{ $eq: ['$login', dto.login] }, 'login', 'email'],
          },
        },
      )
      .lean();

    if (isUserWithThisLoginOrEmailExist) {
      throw new BadRequestException([
        {
          field: isUserWithThisLoginOrEmailExist.matchedField,
          message: `User with this ${isUserWithThisLoginOrEmailExist.matchedField} already exist`,
        },
      ]);
    }

    const passwordHash = await this.bcryptAdapter.generateHash(dto.password);
    const user = await this.userModel.create({
      id: v4(),
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
      createdAt: new Date(),
    });

    await this.userHashesModel.create({
      id: v4(),
      userId: user.id,
      passwordHashes: [passwordHash],
    });

    const emailInfo = new EmailCreateDto(user.id, user.email, isEmailConfirmed);
    await this.emailModel.create(emailInfo);
    return { user: new ReturnUserDto(user, null), emailInfo };
  }

  async findUsers(queryFilters: IQueryFilter) {
    const {
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
      banStatus,
    } = queryFilters;
    let usersResponse = [];
    if (banStatus === 'all') {
      usersResponse = await this.userModel
        .find({
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        })
        .sort({ [sortBy]: sortDirection })
        .skip(pageNumber > 1 ? (pageNumber - 1) * pageSize : 0)
        .limit(pageSize)
        .lean();
    }
    const bannedUsers = await this.banInfoModel.find({ isBanned: true }).lean();
    const bannedUsersIds = bannedUsers.map((m) => m.userId);
    if (banStatus === 'notBanned') {
      usersResponse = await this.userModel
        .find({
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
          id: { $nin: [...bannedUsersIds] },
        })
        .sort({ [sortBy]: sortDirection })
        .skip(pageNumber > 1 ? (pageNumber - 1) * pageSize : 0)
        .limit(pageSize)
        .lean();
    }
    if (banStatus === 'banned') {
      usersResponse = await this.userModel
        .find({
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
          id: [...bannedUsersIds],
        })
        .sort({ [sortBy]: sortDirection })
        .skip(pageNumber > 1 ? (pageNumber - 1) * pageSize : 0)
        .limit(pageSize)
        .lean();
    }

    const users = await Promise.all(
      usersResponse.map(async (user) => {
        const banInfo = await this.banInfoModel.findOne({ userId: user.id });
        return new ReturnUserDto(user, banInfo);
      }),
    );
    let usersCount;
    if (banStatus === 'all') {
      usersCount = await this.userModel
        .find({
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
        })
        .countDocuments();
    }
    if (banStatus === 'notBanned') {
      usersCount = await this.userModel
        .find({
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
          id: { $nin: [...bannedUsersIds] },
        })
        .countDocuments();
    }
    if (banStatus === 'banned') {
      usersCount = await this.userModel
        .find({
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } },
          ],
          id: [...bannedUsersIds],
        })
        .countDocuments();
    }

    const paginationInfo = new PaginationModel(
      pageNumber,
      pageSize,
      usersCount,
    );
    return { ...paginationInfo, items: users };
  }

  async deleteUser(id: string) {
    const deleteResponse = await this.userModel.deleteOne({ id });
    if (deleteResponse.deletedCount !== 1)
      throw new NotFoundException('Not found');
    return;
  }

  async findByUserNameOrEmail(loginOrEmail: string) {
    const user = this.userModel
      .findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      })
      .lean();
    if (user) {
      return user;
    }
    return null;
  }

  async banUnbanUser(userId: string, isBanned: boolean, banReason: string) {
    const banInfo = await this.banInfoModel.findOne({ userId });
    if (!isBanned) {
      if (!banInfo) throw new NotFoundException();
      banInfo.banHistory.push({
        banReason: banInfo.banReason,
        banDate: banInfo.banDate,
      });
      banInfo.banDate = null;
      banInfo.banReason = null;
      banInfo.isBanned = false;
      banInfo.save();
      return;
    }
    if (banInfo) {
      banInfo.banReason = banReason;
      banInfo.isBanned = true;
      banInfo.banDate = new Date();
      banInfo.save();
    } else {
      const banInfoEntity = {
        userId,
        isBanned: true,
        banReason,
        banDate: new Date(),
        banHistory: [],
      };
      await this.banInfoModel.create(banInfoEntity);
    }
    const userTokens = await this.userTokensModel.findOne({ userId });
    const devicesInfo = await this.deviceModel.find({ userId: userId }).lean();
    if (userTokens) {
      userTokens.invalidTokens.push(...devicesInfo.map((m) => m.refreshToken));
      userTokens.save();
    } else {
      await this.userTokensModel.create({
        userId,
        invalidTokens: [...devicesInfo.map((m) => m.refreshToken)],
      });
    }
    return;
  }
}
