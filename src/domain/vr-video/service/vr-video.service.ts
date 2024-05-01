import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  GenerateVrVideoRequestDto,
  VrResourceInfo,
} from '../dto/request/generate-vr-video.request.dto';
import { User } from 'src/domain/user/entity/user.entity';
import { GroupRepository } from 'src/domain/group/repository/group.repository';
import { VrVideoStorageRepository } from 'src/common/gcp/cloud-storage/vr-video-storage.repository';
import { createHash } from 'crypto';
import { VrResourceRepository } from 'src/domain/vr-resource/repository/vr-resource.repository';
import { ObjectDataType } from '../type/object-data.type';
import { VrVideoRepository } from '../repository/vr-video.repository';
import { GroupService } from 'src/domain/group/service/group.service';
import {
  GetVrVideosResponseDto,
  VrResourceDtoForVideo,
} from '../dto/response/get-vr-videos.response.dto';
import { VrResourceStorageRepository } from 'src/common/gcp/cloud-storage/vr-resource-storage.repository';
import { VrVideo } from '../entity/vr-video.entity';
import { SampleGetVrResourcesRequestDto } from 'src/domain/sample/dto/request/sample-get-vr-resource.request.dto';
import { SampleGenerateVideoRequestDto } from 'src/domain/sample/dto/request/sample-generate-video.request.dto';

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

  /* ------------------------------ GET /vr-video ----------------------------- */

  /**
   * @param user userID
   * @returns {GetVrVideosResponseDto[]}
   */
  async getVrVideos(user: User): Promise<GetVrVideosResponseDto[]> {
    // 1. group의 VR 비디오들을 가져옴.
    const groupId = (await this.groupService.getMyGroup(user)).id;
    const vrVideos = await this.vrVideoRepository.findByGroupIdWithResources(
      groupId,
    );
    // 2. 샘플 VR 비디오들을 가져옴.
    const sampleVrVideos = await this.vrVideoRepository.findSamples();
    // 3. DTO 형식으로 return함.
    return await this.makeVrVideoDto(vrVideos.concat(sampleVrVideos));
  }

  /**
   * @param user userID
   * @returns {GetVrVideosResponseDto[]}
   */
  async getSampleVrVideos(): Promise<GetVrVideosResponseDto[]> {
    // 1. get relevant videos
    const sampleVrVideos = await this.vrVideoRepository.findSamples();

    // 2. make DTO
    return await this.makeVrVideoDto(sampleVrVideos);
  }

  /* ----------------------------- POST /vr-video ----------------------------- */

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
    isSample: boolean,
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

    // security / validation check
    if (!scene || avatars.some((avatar) => !avatar)) {
      throw new NotFoundException('Resource not found');
    }
    if (
      (scene.group.id !== group.id && scene.isSample == false) ||
      avatars.some(
        (avatar) => avatar.group.id !== group.id && avatar.isSample == false,
      )
    ) {
      throw new UnauthorizedException('Resource not found');
    }

    // Save VR Video to main DB.
    const vrVideoId = this.generateVrVideoId(user.id);
    await this.vrVideoRepository.createVrVideo(
      vrVideoId,
      title,
      scene,
      avatars,
      isSample,
      group,
    );

    await this.uploadVideoPositionToCloudStorage(
      vrVideoId,
      sceneInfo,
      avatarsInfo,
    );
  }

  async generateSampleVrVideo(
    requestDto: SampleGenerateVideoRequestDto,
    isSample: boolean,
  ): Promise<void> {
    const { title, sceneInfo, avatarsInfo, key } = requestDto;

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
    const vrVideoId = this.generateVrVideoId(key);
    await this.vrVideoRepository.createVrVideo(
      vrVideoId,
      title,
      scene,
      avatars,
      isSample,
    );

    await this.uploadVideoPositionToCloudStorage(
      vrVideoId,
      sceneInfo,
      avatarsInfo,
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                             utilitiy functions                             */
  /* -------------------------------------------------------------------------- */

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

  private async getResourcePositionFileURL(
    vrVideoId: string,
    resourceId: string,
    type: 'scene' | 'avatar',
  ): Promise<string> {
    const signedUrl = await this.vrVideoStorageRepository.generateSignedUrl(
      `vr-video/${vrVideoId}/${type}-${resourceId}.json`,
    );
    return signedUrl;
  }

  /**
   * cloud storage에 scene과 avatar의 위치정보를 업로드
   * @filepath `vr-video/${vrVideoId}/scene-${sceneInfo.resourceId}.json`
   * @param vrVideoId
   * @param sceneInfo
   * @param avatarsInfo
   */
  private async uploadVideoPositionToCloudStorage(
    vrVideoId: string,
    sceneInfo: VrResourceInfo,
    avatarsInfo: VrResourceInfo[],
  ) {
    await this.vrVideoStorageRepository.uploadFile(
      this.convertJsontoJsonFile(
        sceneInfo.objectData,
        `${sceneInfo.resourceId}.json`,
      ),
      `vr-video/${vrVideoId}/scene-${sceneInfo.resourceId}.json`,
    );
    await Promise.all(
      avatarsInfo.map(async (avatarInfo) => {
        await this.vrVideoStorageRepository.uploadFile(
          this.convertJsontoJsonFile(
            avatarInfo.objectData,
            `${avatarInfo.resourceId}.json`,
          ),
          `vr-video/${vrVideoId}/avatar-${avatarInfo.resourceId}.json`,
        );
      }),
    );
  }

  private makeVrVideoDto(
    vrVideos: VrVideo[],
  ): Promise<GetVrVideosResponseDto[]> {
    return Promise.all(
      vrVideos.map(async (vrVideo) => {
        const sceneDto = VrResourceDtoForVideo.of(
          vrVideo.scene,
          await this.vrResourceStorageRepository.generateSignedUrlList(
            vrVideo.scene.filePath,
          ),
          await this.getResourcePositionFileURL(
            vrVideo.id,
            vrVideo.scene.id,
            'scene',
          ),
        );
        const avatarDtos = await Promise.all(
          vrVideo.avatars.map(async (avatar) => {
            return VrResourceDtoForVideo.of(
              avatar,
              await this.vrResourceStorageRepository.generateSignedUrlList(
                avatar.filePath,
              ),
              await this.getResourcePositionFileURL(
                vrVideo.id,
                avatar.id,
                'avatar',
              ),
            );
          }),
        );
        return new GetVrVideosResponseDto(vrVideo, sceneDto, avatarDtos);
      }),
    );
  }
}

// // deprecated
// // /* ---------------------------- GET /vr-video/:id --------------------------- */

// // /**
// //  * videoID를 통해 특정 video만 가져옴
// //  * @param user UserID
// //  * @param videoId videoID
// //  */
// // async getVrVideo(
// //   user: User,
// //   videoId: string,
// // ): Promise<GetVrVideosResponseDto> {
// //   const vrVideo = await this.vrVideoRepository.findById(videoId);
// //   // 1. validation logic
// //   if (!vrVideo) {
// //     throw new NotFoundException('VrVideo not found');
// //   }
// //   const isUserInGroup = await this.groupRepository.isUserInGroup(
// //     user.id,
// //     vrVideo.group.id,
// //   );
// //   if (!isUserInGroup) {
// //     throw new NotFoundException('User is not in the group');
// //   }

// //   // 2. return DTO from DB.
// //   const sceneDto = VrResourceDtoForVideo.of(
// //     vrVideo.scene,
// //     await this.vrResourceStorageRepository.generateSignedUrlList(
// //       vrVideo.scene.filePath,
// //     ),
// //     await this.getResourcePositionFileURL(
// //       vrVideo.id,
// //       vrVideo.scene.id,
// //       'scene',
// //     ),
// //   );
// //   const avatarDtos = await Promise.all(
// //     vrVideo.avatars.map(async (avatar) => {
// //       return VrResourceDtoForVideo.of(
// //         avatar,
// //         await this.vrResourceStorageRepository.generateSignedUrlList(
// //           avatar.filePath,
// //         ),
// //         await this.getResourcePositionFileURL(
// //           vrVideo.id,
// //           avatar.id,
// //           'avatar',
// //         ),
// //       );
// //     }),
// //   );
// //   return new GetVrVideosResponseDto(vrVideo, sceneDto, avatarDtos);
// // }
