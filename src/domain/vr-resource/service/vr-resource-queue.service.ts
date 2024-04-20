import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { VrResourceStorageRepository } from 'src/common/gcp/cloud-storage/vr-resource-storage.repository';
import { AiTaskRequestRepository } from '../repository/ai-task-request.repository';
import { AiTaskRequest } from '../../sample/document/ai-task-request.document';
import { GroupService } from 'src/domain/group/group.service';
import { User } from 'src/domain/user/entity/user.entity';
import { AiTaskQueueRepository } from '../../sample/repository/ai-task-queue.repository';
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
    const sceneVideoPath = `3dgs-request/scene/${requestId}/video`;
    await this.vrResourceStorageRepository.uploadFile(video, sceneVideoPath);

    // 2. Store request data to Firestore.
    const task: AiTaskRequest = {
      // necessary
      id: requestId,
      groupId: (await this.groupService.getMyGroup(user)).id,
      creatorId: user.id,
      title: title,
      status: 'pending',
      createdAt: new Date(),
      // scene
      type: 'scene',
      location: location,
      sceneVideoPath: sceneVideoPath,
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
    face: Express.Multer.File,
    body: Express.Multer.File,
    user: User,
  ): Promise<void> {
    const { title, gender } = requestDto;
    const requestId = this.generateRequestId(user.id);

    // 1. Store file source to GCP Cloud Storage.
    const faceFilePath = `3dgs-request/avatar/${requestId}/body`;
    await this.vrResourceStorageRepository.uploadFile(body, faceFilePath);
    const bodyImagePath = `3dgs-request/avatar/${requestId}/face`;
    await this.vrResourceStorageRepository.uploadFile(face, bodyImagePath);

    // 2. Store request data to Firestore.
    const task: AiTaskRequest = {
      // necessary
      id: requestId,
      groupId: (await this.groupService.getMyGroup(user)).id,
      creatorId: user.id,
      title: title,
      status: 'pending',
      createdAt: new Date(),
      // avatar
      type: 'avatar',
      bodyImagePath: bodyImagePath,
      faceImagePath: faceFilePath,
      gender: gender,
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
