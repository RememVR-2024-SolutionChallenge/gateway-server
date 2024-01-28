import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserFetchService {
  constructor(private readonly userRepository: UserRepository) {}

  async getMyProfile(userId: string) {
    // return this.userRepository.findByIdWithRelations(userId);
  }
}
