import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { CloudStorageRepository } from 'src/common/gcp/cloud-storage/cloud-storage.repository';
import { AiTaskRequestRepository } from '../repository/ai-task-request.repository';
import { AiTaskRequest } from '../document/ai-task-request.document';
import { GroupService } from 'src/domain/group/group.service';
import { User } from 'src/domain/user/entity/user.entity';
import { AiTaskQueueRepository } from '../repository/ai-task-queue.repository';
import { CloudFunctionsRepository } from 'src/common/gcp/cloud-functions/cloud-functions.repository';

@Injectable()
export class VrResourceQueueService {
  constructor(
    private readonly cloudStorageRepository: CloudStorageRepository,
    private readonly aiTaskRequestRepository: AiTaskRequestRepository,
    private readonly groupService: GroupService,
    private readonly aiTaskQueueRepository: AiTaskQueueRepository,
    private readonly cloudFunctionsRepository: CloudFunctionsRepository,
  ) {}

  async queueAiTask(requestDto, video, user): Promise<void> {
    const { type, title } = requestDto;
    const requestId = this.generateRequestId(user.id);

    // 1. GCP Cloud Storage에 해당 인풋 저장
    const videoPath = `3dgs-request/${type}/${requestId}`;
    await this.cloudStorageRepository.uploadFile(video, videoPath);

    // 2. Fire Store에 해당 리퀘스트 관련 데이터 저장
    const task: AiTaskRequest = {
      id: requestId,
      title: title,
      type: type,
      status: 'pending',
      videoPath: videoPath,
      groupId: (await this.groupService.getMyGroup(user)).id,
      creatorId: user.id,
      createdAt: new Date(),
    };
    await this.aiTaskRequestRepository.addTask(requestId, task);

    // 3. Redis Queue에 Task들 저장
    await this.aiTaskQueueRepository.queueRequest(requestId);

    // 4. GCP Cloud Functions 트리거
    await this.cloudFunctionsRepository.triggerAiScheduler(requestId);
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
