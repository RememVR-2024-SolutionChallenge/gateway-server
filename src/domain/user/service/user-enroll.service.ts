import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { EnrollInfoRequestDto } from '../dto/request/enroll-info.request.dto';
import { User } from '../entity/user.entity';
import { EnrollCareRequestDto } from '../dto/request/enroll-care.reuqest.dto';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class UserEnrollService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async enrollInfo(dto: EnrollInfoRequestDto, user: User): Promise<void> {
    const { role } = dto;

    // 역할 등록
    user.role = role;
    // 피보호자의 경우에는 여기서 등록이 마무리 될 수 있도록
    if (role == 'CareRecipient') user.isEnrolled = true;
    await this.userRepository.save(user);

    return;
  }

  async enrollCareEmail(dto: EnrollCareRequestDto, user: User): Promise<void> {
    const { email } = dto;
    const careRecipient = await this.userRepository.findByEmail(email);

    if (!careRecipient)
      throw new NotFoundException('피보호자의 계정이 존재하지 않습니다.');
    if (email == user.email)
      throw new BadRequestException('자기 자신을 등록할 수 없습니다.');

    const certificate = String(Math.floor(Math.random() * 10000)).padStart(
      4,
      '0',
    );
    this.emailService.sendCareRelationshipCert(email, certificate);

    return;
  }
}
