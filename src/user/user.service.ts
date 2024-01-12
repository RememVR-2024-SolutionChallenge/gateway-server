import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EnrollRequestDto } from './dto/request/enroll.request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async join(dto: EnrollRequestDto): Promise<void> {
    // const { role } = dto;
    // const user = await this.userRepository.findById;

    return;
  }
}
