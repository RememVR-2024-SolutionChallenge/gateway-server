import { Injectable, NotFoundException } from '@nestjs/common';
import { GenerateVrVideoRequestDto } from '../dto/request/generate-vr-video.request.dto';
import { User } from 'src/domain/user/entity/user.entity';
import { GroupRepository } from 'src/domain/group/repository/group.repository';
import { VrVideoStorageRepository } from 'src/common/gcp/cloud-storage/vr-video-storage.repository';
import { VrVideo } from '../entity/vr-video.entity';
import { createHash } from 'crypto';
import { VrResourceRepository } from 'src/domain/vr-resource/repository/vr-resource.repository';
import { ObjectDataType } from '../type/object-data.type';
import { VrVideoRepository } from '../repository/vr-video.repository';
import { GroupService } from 'src/domain/group/group.service';
import { GetVrVideosResponseDto } from '../dto/response/get-vr-videos.response.dto';
import { VrResourceDto } from 'src/domain/vr-resource/dto/response/get-vr-resources.response.dto';
import { VrResourceStorageRepository } from 'src/common/gcp/cloud-storage/vr-resource-storage.repository';
import { NotFoundError } from 'rxjs';

@Injectable()
export class VrVideoService {
  constructor(
    private readonly groupService: GroupService,
    private readonly groupRepository: GroupRepository,
    private readonly vrVideoStorageRepository: VrVideoStorageRepository,
    private readonly vrResourceStorageRepository: VrResourceStorageRepository,
    private readonly vrResourceRepository: VrResourceRepository,
    private readonly vrVideoRepository: VrVideoRepository,
  ) {}

  /**
   * videoID를 통해 특정 video만 가져옴
   * @param user UserID
   * @param videoId videoID
   */
  async getVrVideo(
    user: User,
    videoId: string,
  ): Promise<GetVrVideosResponseDto> {
    const vrVideo = await this.vrVideoRepository.findById(videoId);
    // 1. validation logic
    if (!vrVideo) {
      throw new NotFoundException('VrVideo not found');
    }
    const isUserInGroup = await this.groupRepository.isUserInGroup(
      user.id,
      vrVideo.group.id,
    );
    if (!isUserInGroup) {
      throw new NotFoundException('User is not in the group');
    }

    // 2. return DTO from DB.
    const sceneDto = VrResourceDto.of(
      vrVideo.scene,
      await this.vrResourceStorageRepository.generateSignedUrlList(
        vrVideo.scene.filePath,
      ),
    );
    const avatarDtos = await Promise.all(
      vrVideo.avatars.map(async (avatar) => {
        return VrResourceDto.of(
          avatar,
          await this.vrResourceStorageRepository.generateSignedUrlList(
            avatar.filePath,
          ),
        );
      }),
    );
    return new GetVrVideosResponseDto(vrVideo, sceneDto, avatarDtos);
  }

  /**
   * @param user userID
   * @returns {GetVrVideosResponseDto[]}
   */
  async getVrVideos(user: User): Promise<GetVrVideosResponseDto[]> {
    const groupId = (await this.groupService.getMyGroup(user)).id;
    const vrVideos = await this.vrVideoRepository.findByGroupIdWithResources(
      groupId,
    );

    return await Promise.all(
      vrVideos.map(async (vrVideo) => {
        const sceneDto = VrResourceDto.of(
          vrVideo.scene,
          await this.vrResourceStorageRepository.generateSignedUrlList(
            vrVideo.scene.filePath,
          ),
        );
        const avatarDtos = await Promise.all(
          vrVideo.avatars.map(async (avatar) => {
            return VrResourceDto.of(
              avatar,
              await this.vrResourceStorageRepository.generateSignedUrlList(
                avatar.filePath,
              ),
            );
          }),
        );
        return new GetVrVideosResponseDto(vrVideo, sceneDto, avatarDtos);
      }),
    );
  }

  /**
   * DB에는 관계정보(avatar, scene)를 저장하고,
   * avatar의 id를 기반으로 cloud storage에 .json파일을 저장.
   * (즉, DB에는 videoId는 존재하여도 cloud storage의 filePath는 존재하지 않음.)
   * @param user userId
   * @param requestDto GenerateVrVideoRequestDto
   * @returns {void}
   */
  async generateVrVideo(
    user: User,
    requestDto: GenerateVrVideoRequestDto,
  ): Promise<void> {
    const group = await this.groupRepository.findByCareGiverId(user.id);
    const { title, sceneInfo, avatarsInfo } = requestDto;

    // Get VR Resource From DB.
    const scene = await this.vrResourceRepository.findById(
      sceneInfo.resourceId,
    );
    const avatars = await Promise.all(
      avatarsInfo.map(async (avatarInfo) => {
        const avatar = await this.vrResourceRepository.findById(
          avatarInfo.resourceId,
        );
        return avatar;
      }),
    );
    if (!scene || avatars.some((avatar) => !avatar)) {
      throw new NotFoundException('Resource not found');
    }

    // Save VR Video to main DB.
    const vrVideo = new VrVideo();
    vrVideo.id = this.generateVrVideoId(user.id);
    vrVideo.title = title;
    vrVideo.scene = scene;
    vrVideo.avatars = avatars;
    vrVideo.group = group;
    await this.vrVideoRepository.save(vrVideo);

    // Save position in Json on Cloud Storage.
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

  /* ---------------------------- utility functions --------------------------- */

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
