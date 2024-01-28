import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRepository } from './repository/group.repository';
import { User } from '../user/entity/user.entity';
import { Group } from './entity/group.entity';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async getMyGroup(user: User): Promise<Group> {
    if (user.role == 'CareGiver') {
      return await this.groupRepository.findByCareGiverId(user.id);
    }
    if (user.role == 'CareRecipient') {
      return await this.groupRepository.findByCareRecepientId(user.id);
    }
  }
}
