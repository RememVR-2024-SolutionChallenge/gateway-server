import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { VrResourceStorageRepository } from 'src/common/gcp/cloud-storage/vr-resource-storage.repository';
import { SampleAiTaskRequestRepository } from '../../../common/gcp/firestore/repository/sample-ai-task-request.repository';
import { SampleAiTaskRequest } from '../../../common/gcp/firestore/document/sample-ai-task-request.document';
import { CloudFunctionsRepository } from 'src/common/gcp/cloud-functions/cloud-functions.repository';
import { SampleGenerateSceneRequestDto } from '../dto/request/sample-generate-scene.request.dto';
import { SampleGenerateAvatarRequestDto } from '../dto/request/sample-generate-avatar.request.dto';

// NOTE: sample uses the same queue with normal request
import { AiTaskQueueRepository } from '../../../common/gcp/memorystore/ai-task-queue.repository';
import { SampleVrResourceDto } from '../dto/response/sample-get-vr-resources.response.dto';
import { SampleVrResourceRepository } from '../repository/sample-vr-resource.repository';

@Injectable()
export class SampleVrResourceService {
  constructor(
    // sample has difference in database entity.
    private readonly vrResourceRepository: SampleVrResourceRepository,
    private readonly aiTaskRequestRepository: SampleAiTaskRequestRepository,

    // but, shared queue, storage, etc...
    private readonly vrResourceStorageRepository: VrResourceStorageRepository,
    private readonly aiTaskQueueRepository: AiTaskQueueRepository,
    private readonly cloudFunctionsRepository: CloudFunctionsRepository,
  ) {}

  async generateScene(
    requestDto: SampleGenerateSceneRequestDto,
    video: Express.Multer.File,
  ): Promise<void> {
    const { title, location } = requestDto;
    const requestId = this.generateRequestId();

    // 1. Store face source to GCP Cloud Storage.
    const sceneVideoPath = `3dgs-request/scene/${requestId}/video`;
    await this.vrResourceStorageRepository.uploadFile(video, sceneVideoPath);

    // 2. Store request data to Firestore.
    const task: SampleAiTaskRequest = {
      // necessary
      id: requestId,
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
    requestDto: SampleGenerateAvatarRequestDto,
    face: Express.Multer.File,
    body: Express.Multer.File,
  ): Promise<void> {
    const { title, gender } = requestDto;
    const requestId = this.generateRequestId();

    // 1. Store file source to GCP Cloud Storage.
    const faceFilePath = `3dgs-request/avatar/${requestId}/body`;
    await this.vrResourceStorageRepository.uploadFile(body, faceFilePath);
    const bodyImagePath = `3dgs-request/avatar/${requestId}/face`;
    await this.vrResourceStorageRepository.uploadFile(face, bodyImagePath);

    // 2. Store request data to Firestore.
    const task: SampleAiTaskRequest = {
      // necessary
      id: requestId,
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

  async getVrResources(): Promise<SampleVrResourceDto[]> {
    const vrResources = await this.vrResourceRepository.find();
    const vrResourceDtos = await Promise.all(
      vrResources.map(async (vrResource) => {
        const storageUrls =
          await this.vrResourceStorageRepository.generateSignedUrlList(
            vrResource.filePath,
          );
        return SampleVrResourceDto.of(vrResource, storageUrls);
      }),
    );

    return vrResourceDtos;
  }

  private generateRequestId(): string {
    const currentTime = Date.now().toString();
    const data = `${currentTime}`;
    const hash = createHash('sha256').update(data).digest('hex');
    return hash;
  }
}
