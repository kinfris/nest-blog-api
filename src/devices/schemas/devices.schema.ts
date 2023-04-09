import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema()
export class Device {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  lastActiveDate: number;

  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  expiredAt: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
