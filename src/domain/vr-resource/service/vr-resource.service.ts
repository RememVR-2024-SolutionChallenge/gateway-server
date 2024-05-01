import { Injectable } from '@nestjs/common';
import { GroupService } from 'src/domain/group/service/group.service';
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
    // 1. Get VR resource (sample, real both)
    const groupId = (await this.groupService.getMyGroup(user)).id;
    const vrResources = await this.vrResourceRepository.findByGroupId(groupId);
    const sampleVrResources = await this.vrResourceRepository.findSamples();

    // 2. make as dto.
    const vrResourceDtos = await this.makeVrResourceDto(
      vrResources.concat(sampleVrResources),
    );
    return vrResourceDtos;
  }

  async getSampleVrResources(): Promise<VrResourceDto[]> {
    // 1. Get VR resource (sample)
    const sampleVrResources = await this.vrResourceRepository.findSamples();

    // 2. make as dto.
    const vrResourceDtos = await this.makeVrResourceDto(sampleVrResources);
    return vrResourceDtos;
  }

  /* -------------------------------------------------------------------------- */
  private makeVrResourceDto(
    vrResources: VrResource[],
  ): Promise<VrResourceDto[]> {
    return Promise.all(
      vrResources.map(async (vrResource) => {
        const storageUrls =
          await this.vrResourceStorageRepository.generateSignedUrlList(
            vrResource.filePath,
          );
        return VrResourceDto.of(vrResource, storageUrls);
      }),
    );
  }
}
