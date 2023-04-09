import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmation(email: string, code: string) {
    const info = await this.mailerService.sendMail({
      from: `"Node.js Back 👻" <${process.env.EMAIL_LOGIN}>`, // sender address
      to: email,
      subject: 'Email confirmation',
      html: `<div><a href="${process.env.WORKING_URL}auth/registration-confirmation?code=${code}">Confirm Email</a></div>`, // HTML body content
    });
    return info;
  }

  async sendRecovery(email: string, recoveryCode: string) {
    const info = await this.mailerService.sendMail({
      from: `"Node.js Back 👻" <${process.env.EMAIL_LOGIN}>`, // sender address
      to: email, // list of receivers
      subject: 'Recovery password',
      html: `<div><a href="${process.env.WORKING_URL}auth/registration-confirmation?recoveryCode=${recoveryCode}">Recovery password</a></div>`, // html body
    });
    return info;
  }
}
