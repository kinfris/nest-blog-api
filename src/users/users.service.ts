import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './users.conroller';
import { BcryptAdapter } from '../providers/bcryptAdapter';
import { ReturnUserDto } from './dto/user.dto';
import { IQueryFilter } from '../dto/queryFilter.model';
import { PaginationModel } from '../dto/pagination.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private bcryptAdapter: BcryptAdapter,
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      const isUserWithThisLoginExist = await this.userModel.findOne({
        login: dto.login,
      });
      if (isUserWithThisLoginExist) {
        return { error: true, message: 'User with this login already exist' };
      }
      const isUserWithThisEmailExist = await this.userModel.findOne({
        email: dto.email,
      });
      if (isUserWithThisEmailExist) {
        return { error: true, message: 'User with this email already exist' };
      }

      const passwordInfo = await this.bcryptAdapter.generateHash(dto.password);
      const user = await this.userModel.create({
        login: dto.login,
        email: dto.email,
        passwordHash: passwordInfo.passwordHash,
        passwordSalt: passwordInfo.passwordSalt,
      });
      return new ReturnUserDto(user);
    } catch (e) {
      console.log(e);
    }
  }

  async findUsers(queryFilters: IQueryFilter) {
    const {
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
      sortBy,
      sortDirection,
    } = queryFilters;
    const usersResponse = await this.userModel
      .find({
        $or: [
          { login: { $regex: searchLoginTerm, $options: 'i' } },
          { email: { $regex: searchEmailTerm, $options: 'i' } },
        ],
      })
      .sort({ [sortBy]: sortDirection === 'desc' ? -1 : 1 })
      .skip(pageNumber > 0 ? (pageNumber - 1) * pageSize : 0)
      .limit(pageSize)
      .lean();
    const users = usersResponse.map((user) => new ReturnUserDto(user));
    const usersCount = await this.userModel
      .find({
        $or: [
          { login: { $regex: searchLoginTerm, $options: 'i' } },
          { email: { $regex: searchEmailTerm, $options: 'i' } },
        ],
      })
      .countDocuments();
    const paginationInfo = new PaginationModel(
      pageNumber,
      pageSize,
      usersCount,
    );
    return { ...paginationInfo, items: users };
  }

  async deleteUser(id: string) {
    try {
      const _id = new mongoose.Types.ObjectId(id);
      const deleteResponse = await this.userModel.deleteOne({ _id });
      return deleteResponse.deletedCount === 1;
    } catch (e) {
      console.log(e);
    }
  }
}
