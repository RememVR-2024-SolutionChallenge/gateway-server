import { Injectable } from '@nestjs/common';
import { GroupService } from 'src/domain/group/group.service';
import { VrResourceRepository } from '../repository/vr-resource.repository';
import { User } from 'src/domain/user/entity/user.entity';
import { VrResource } from '../entity/vr-resource.entity';
import { VrResourceStorageRepository } from 'src/common/gcp/cloud-storage/vr-resource-storage.repository';
import { VrResourceDto } from '../dto/response/get-vr-resources.response.dto';

@Injectable()
export class VrResourceService {
  constructor(
    private readonly groupService: GroupService,
    private readonly vrResourceRepository: VrResourceRepository,
    private readonly vrResourceStorageRepository: VrResourceStorageRepository,
  ) {}

  async getVrResources(user: User): Promise<VrResourceDto[]> {
    const groupId = (await this.groupService.getMyGroup(user)).id;

    const vrResources = await this.vrResourceRepository.findByGroupId(groupId);
    const vrResourceDtos = await Promise.all(
      vrResources.map(async (vrResource) => {
        const storageUrls =
          await this.vrResourceStorageRepository.generateSignedUrlList(
            vrResource.filePath,
          );
        return VrResourceDto.of(vrResource, storageUrls);
      }),
    );

    return vrResourceDtos;
  }
}
