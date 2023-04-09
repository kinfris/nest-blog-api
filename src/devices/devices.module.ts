import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.conroller';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schemas/devices.schema';
import { User, UserSchema } from '../users/shemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
