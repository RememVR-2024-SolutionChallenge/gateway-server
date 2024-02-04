import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { EnrollInfoRequestDto } from '../dto/request/enroll-info.request.dto';
import { User } from '../entity/user.entity';
import { EnrollCareEmailRequestDto } from '../dto/request/enroll-care-email.reuqest.dto';
import { EmailService } from 'src/common/email/email.service';
import { CareEnrollRepository } from '../repository/care-enroll.repository';
import { EnrollCareCertRequestDto } from '../dto/request/enroll-care-cert.request.dto';
import { Group } from '../../group/entity/group.entity';
import { GroupRepository } from '../../group/repository/group.repository';

@Injectable()
export class UserEnrollService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly careEnrollRepository: CareEnrollRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async enrollInfo(dto: EnrollInfoRequestDto, user: User): Promise<void> {
    user.role = dto.role;
    user.name = dto.name;
    await this.userRepository.save(user);
  }

  async enrollCareEmail(
    dto: EnrollCareEmailRequestDto,
    user: User,
  ): Promise<void> {
    const { email } = dto;
    const careRecipient = await this.userRepository.findByEmail(email);

    if (!careRecipient)
      throw new NotFoundException('피보호자의 계정이 존재하지 않습니다.');
    if (careRecipient.role != 'CareRecipient')
      throw new BadRequestException('피보호자만 등록할 수 있습니다.');
    if (email == user.email)
      throw new BadRequestException('자기 자신을 등록할 수 없습니다.');

    const certificate = String(Math.floor(Math.random() * 10000)).padStart(
      4,
      '0',
    );

    // certificate 이메일로 발송
    await this.emailService.sendCareRelationshipCert(email, certificate);
    // certificate을 redis로 저장
    await this.careEnrollRepository.saveCertFor30m(
      user.email,
      email,
      certificate,
    );
  }

  async enrollCareCert(
    dto: EnrollCareCertRequestDto,
    user: User,
  ): Promise<void> {
    const { email: recipientEmail, certificate } = dto;

    // certficate의 유효성 검사
    const key = `cert:${user.email}:${recipientEmail}`;
    const cert = await this.careEnrollRepository.getCert(key);
    if (!cert) throw new UnauthorizedException('유효한 인증정보가 없습니다.');
    if (cert != certificate)
      throw new UnauthorizedException('인증정보가 일치하지 않습니다.');

    // 피보호자 검색
    const careRecipient = await this.userRepository.findByEmail(recipientEmail);
    if (!careRecipient) {
      throw new BadRequestException('피보호자의 계정이 존재하지 않습니다.');
    }

    // 보호관계 등록
    const group = new Group();
    group.id = careRecipient.id;
    group.recipient = careRecipient;
    group.givers = group.givers || [];
    group.givers.push(user);
    await this.groupRepository.save(group);

    // 보호자, 피보호자: 최초 정보등록 완료
    careRecipient.isEnrolled = true;
    await this.userRepository.save(careRecipient);
    user.isEnrolled = true;
    await this.userRepository.save(user);
  }
}
