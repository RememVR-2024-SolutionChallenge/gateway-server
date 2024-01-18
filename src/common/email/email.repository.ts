import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailRepository {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get('NODEMAILER_USER'),
        pass: this.configService.get('NODEMAILER_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    let info = await this.transporter.sendMail({
      from: `"Remember-Me Team" <${this.configService.get('NODEMAILER_USER')}>`,
      to: to,
      subject: subject,
      text: body,
    });

    return {
      status: 'Success',
      code: 200,
      message: 'Sent Auth Email',
    };
  }
}
