import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { VrResourceStorageRepository } from 'src/common/gcp/cloud-storage/vr-resource-storage.repository';
import { AiTaskRequestRepository } from '../repository/ai-task-request.repository';
import { AiTaskRequest } from '../document/ai-task-request.document';
import { GroupService } from 'src/domain/group/group.service';
import { User } from 'src/domain/user/entity/user.entity';
import { AiTaskQueueRepository } from '../repository/ai-task-queue.repository';
import { CloudFunctionsRepository } from 'src/common/gcp/cloud-functions/cloud-functions.repository';
import { GenerateSceneRequestDto } from '../dto/request/generate-scene.request.dto';
import { GenerateAvatarRequestDto } from '../dto/request/generate-avatar.request.dto';

@Injectable()
export class VrResourceQueueService {
  constructor(
    private readonly vrResourceStorageRepository: VrResourceStorageRepository,
    private readonly aiTaskRequestRepository: AiTaskRequestRepository,
    private readonly groupService: GroupService,
    private readonly aiTaskQueueRepository: AiTaskQueueRepository,
    private readonly cloudFunctionsRepository: CloudFunctionsRepository,
  ) {}

  async generateScene(
    requestDto: GenerateSceneRequestDto,
    video: Express.Multer.File,
    user: User,
  ): Promise<void> {
    const { title, location } = requestDto;
    const requestId = this.generateRequestId(user.id);

    // 1. Store video source to GCP Cloud Storage.
    const videoPath = `3dgs-request/scene/${requestId}/video`;
    await this.vrResourceStorageRepository.uploadFile(video, videoPath);

    // 2. Store request data to Firestore.
    const task: AiTaskRequest = {
      id: requestId,
      title: title,
      type: 'scene',
      status: 'pending',
      location: location,
      videoPath: videoPath,
      groupId: (await this.groupService.getMyGroup(user)).id,
      creatorId: user.id,
      createdAt: new Date(),
    };
    await this.aiTaskRequestRepository.addTask(requestId, task);

    // 3. Store taskId to Redis Queue.
    await this.aiTaskQueueRepository.queueRequest(requestId);

    // 4. Trigger GCP Cloud Functions.
    await this.cloudFunctionsRepository.triggerAiScheduler();
    return;
  }

  async generateAvatar(
    requestDto: GenerateAvatarRequestDto,
    video: Express.Multer.File,
    image: Express.Multer.File,
    user: User,
  ): Promise<void> {
    const { title, gender } = requestDto;
    const requestId = this.generateRequestId(user.id);

    // 1. Store image source to GCP Cloud Storage.
    const imagePath = `3dgs-request/avatar/${requestId}/image`;
    await this.vrResourceStorageRepository.uploadFile(image, imagePath);
    const videoPath = `3dgs-request/avatar/${requestId}/video`;
    await this.vrResourceStorageRepository.uploadFile(video, videoPath);

    // 2. Store request data to Firestore.
    const task: AiTaskRequest = {
      id: requestId,
      title: title,
      type: 'avatar',
      status: 'pending',
      gender: gender,
      videoPath: videoPath,
      imagePath: imagePath,
      groupId: (await this.groupService.getMyGroup(user)).id,
      creatorId: user.id,
      createdAt: new Date(),
    };
    await this.aiTaskRequestRepository.addTask(requestId, task);

    // 3. Store taskId to Redis Queue.
    await this.aiTaskQueueRepository.queueRequest(requestId);

    // 4. Trigger GCP Cloud Functions.
    await this.cloudFunctionsRepository.triggerAiScheduler();
    return;
  }

  async getAiTaskQueue(user: User): Promise<AiTaskRequest[]> {
    // userId로 그룹Id 알아내기
    const groupId = (await this.groupService.getMyGroup(user)).id;
    // 그룹Id를 기반으로 FireStore에서 완성되지 않은 요청 받아오기
    return await this.aiTaskRequestRepository.getQueuedTasksByGroupId(groupId);
  }

  private generateRequestId(userId: string): string {
    const currentTime = Date.now().toString();
    const data = `${currentTime}-${userId}`;
    const hash = createHash('sha256').update(data).digest('hex');
    return hash;
  }
}
