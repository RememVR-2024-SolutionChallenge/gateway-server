import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EnrollRequestDto } from './dto/request/enroll.request.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async join(dto: EnrollRequestDto, user: User): Promise<void> {
    const { role } = dto;
    user.role = role;
    await this.userRepository.save(user);
    return;
  }
}
