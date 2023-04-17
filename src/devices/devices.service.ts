import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from './schemas/devices.schema';
import { User, UserDocument } from '../users/shemas/users.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async getUserSessions(refreshToken: string) {
    const tokenPayload = this.verifyToken(refreshToken);
    const sessions = await this.deviceModel
      .find({ userId: tokenPayload.sub })
      .lean();
    if (sessions.length === 0) throw new UnauthorizedException();
    return sessions.map((m) => ({
      ip: m.ip,
      title: m.title,
      lastActiveDate: m.lastActiveDate,
      deviceId: m.id,
    }));
  }

  async deleteAllSessionsExceptCurrent(refreshToken: string) {
    const tokenPayload = this.verifyToken(refreshToken);
    if (!tokenPayload) throw new UnauthorizedException();
    await this.deviceModel.deleteMany({
      userId: tokenPayload.sub,
      id: { $nin: [tokenPayload.deviceId] },
    });
    return;
  }

  async deleteCurrenSession(refreshToken: string, deviceId: string) {
    const tokenPayload = this.verifyToken(refreshToken);
    const session = await this.deviceModel.findOne({
      id: tokenPayload.deviceId,
    });
    if (tokenPayload.sub !== session.userId) throw new ForbiddenException();
    if (!session || tokenPayload.deviceId !== deviceId)
      throw new NotFoundException();
    await this.deviceModel.deleteOne({ id: tokenPayload.deviceId });
    return;
  }

  verifyToken(refreshToken) {
    try {
      const tokenPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      return tokenPayload;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
