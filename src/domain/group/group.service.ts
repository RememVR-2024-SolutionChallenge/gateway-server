import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRepository } from './repository/group.repository';
import { User } from '../user/entity/user.entity';
import { Group } from './entity/group.entity';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getMyGroup(user: User) {
    if (user.role != 'CareGiver' && user.role != 'CareRecipient') {
      throw new BadRequestException(
        '최초 정보 기입 후 이용할 수 있는 항목입니다.',
      );
    }
    if (user.role == 'CareGiver') {
      return await this.groupRepository.findByCareGiverId(user.id);
    }
    if (user.role == 'CareRecipient') {
      return await this.groupRepository.findByCareRecepientId(user.id);
    }
  }
}
