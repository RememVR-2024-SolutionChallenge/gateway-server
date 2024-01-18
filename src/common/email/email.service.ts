import { Injectable } from '@nestjs/common';
import { EmailRepository } from './email.repository';

@Injectable()
export class EmailService {
  constructor(private readonly emailRepository: EmailRepository) {}

  async sendCareRelationshipCert(to: string, code: string) {
    const title = '[Remember Me] Care Giver Registration Authentication Mail';
    const body = `Your authentication code is "${code}". \nIt must not be disclosed to anyone other than the your care giver.`;
    this.emailRepository.sendEmail(to, title, body);
  }
}
