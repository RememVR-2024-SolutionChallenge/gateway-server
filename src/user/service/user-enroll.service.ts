import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { EnrollInfoRequestDto } from '../dto/request/enroll-info.request.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UserEnrollService {
  constructor(private readonly userRepository: UserRepository) {}

  async enrollInfo(dto: EnrollInfoRequestDto, user: User): Promise<void> {
    const { role } = dto;
    user.role = role;
    await this.userRepository.save(user);

    if (role == 'CareRecipient') {
    }

    return;
  }
}
