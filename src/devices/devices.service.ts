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
    const tokenPayload = this.jwtService.verify(refreshToken);
    const sessions = await this.deviceModel
      .find({ userId: tokenPayload.sub })
      .lean();
    if (sessions.length === 0) throw new UnauthorizedException();
    return sessions;
  }

  async deleteAllSessionsExceptCurrent(refreshToken: string) {
    const tokenPayload = this.jwtService.verify(refreshToken);
    if (!tokenPayload) throw new UnauthorizedException();
    await this.deviceModel.deleteMany({
      userId: tokenPayload.sub,
      deviceId: { $nin: [tokenPayload.deviceId] },
    });
    return;
  }

  async deleteCurrenSession(refreshToken: string, deviceID: string) {
    const tokenPayload = this.jwtService.verify(refreshToken);
    if (!tokenPayload) throw new UnauthorizedException();
    const session = await this.deviceModel.findOne({ id: deviceID });
    if (!session) throw new NotFoundException('Not found');
    if (tokenPayload.sub !== session.userId) throw new ForbiddenException();
    await this.deviceModel.deleteOne({ id: deviceID });
    return;
  }
}
