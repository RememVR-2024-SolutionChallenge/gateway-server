import { Injectable } from '@nestjs/common';
import { GroupService } from 'src/domain/group/group.service';
import { VrResourceRepository } from '../repository/vr-resource.repository';
import { User } from 'src/domain/user/entity/user.entity';
import { VrResource } from '../entity/vr-resource.entity';

@Injectable()
export class VrResourceService {
  constructor(
    private readonly groupService: GroupService,
    private readonly vrResourceRepository: VrResourceRepository,
  ) {}

  async getVrResources(user: User): Promise<VrResource[]> {
    const groupId = (await this.groupService.getMyGroup(user)).id;
    return await this.vrResourceRepository.findByGroupId(groupId);
  }
}
