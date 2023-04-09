import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailDocument = HydratedDocument<Email>;

@Schema()
export class Email {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  isConfirmed: boolean;

  @Prop({ required: true })
  confirmationCode: string;

  @Prop()
  recoveryCode: string;

  @Prop({ required: true })
  expirationDate: Date;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
