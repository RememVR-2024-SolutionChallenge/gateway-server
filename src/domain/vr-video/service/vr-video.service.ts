import { Injectable } from '@nestjs/common';
import { GenerateVrVideoRequestDto } from '../dto/request/generate-vr-video.request.dto';
import { User } from 'src/domain/user/entity/user.entity';
import { GroupRepository } from 'src/domain/group/repository/group.repository';
import { VrVideoStorageRepository } from 'src/common/gcp/cloud-storage/vr-video-storage.repository';
import { VrVideo } from '../entity/vr-video.entity';
import { createHash } from 'crypto';
import { VrResourceRepository } from 'src/domain/vr-resource/repository/vr-resource.repository';
import { ObjectDataType } from '../type/object-data.type';
import { VrVideoRepository } from '../repository/vr-video.repository';

@Injectable()
export class VrVideoService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly vrVideoStorageRepository: VrVideoStorageRepository,
    private readonly vrResourceRepository: VrResourceRepository,
    private readonly vrVideoRepository: VrVideoRepository,
  ) {}

  async generateVrVideo(
    user: User,
    requestDto: GenerateVrVideoRequestDto,
  ): Promise<void> {
    const group = await this.groupRepository.findByCareGiverId(user.id);
    const { title, sceneInfo, avatarsInfo } = requestDto;

    // Save to main DB.
    const vrVideo = new VrVideo();
    vrVideo.id = this.generateVrVideoId(user.id);
    vrVideo.title = title;
    vrVideo.scene = await this.vrResourceRepository.findById(
      sceneInfo.resourceId,
    );
    vrVideo.avatars = await Promise.all(
      avatarsInfo.map(async (avatarInfo) => {
        const avatar = await this.vrResourceRepository.findById(
          avatarInfo.resourceId,
        );
        return avatar;
      }),
    );
    vrVideo.group = group;
    await this.vrVideoRepository.save(vrVideo);

    // Save to Position Json file Cloud Storage.
    await this.vrVideoStorageRepository.uploadFile(
      this.convertJsontoJsonFile(
        sceneInfo.objectData,
        `${sceneInfo.resourceId}.json`,
      ),
      `${sceneInfo.resourceId}.json`,
    );
    await Promise.all(
      avatarsInfo.map(async (avatarInfo) => {
        await this.vrVideoStorageRepository.uploadFile(
          this.convertJsontoJsonFile(
            avatarInfo.objectData,
            `${avatarInfo.resourceId}.json`,
          ),
          `${avatarInfo.resourceId}.json`,
        );
      }),
    );
  }

  private convertJsontoJsonFile(
    json: ObjectDataType,
    name: string,
  ): Express.Multer.File {
    const jsonContent = JSON.stringify(json);
    const objectDataBuffer = Buffer.from(jsonContent);
    return {
      buffer: objectDataBuffer,
      originalname: name,
    } as Express.Multer.File;
  }

  private generateVrVideoId(userId: string): string {
    const currentTime = Date.now().toString();
    const data = `${currentTime}-${userId}`;
    const hash = createHash('sha256').update(data).digest('hex');
    return hash;
  }
}
