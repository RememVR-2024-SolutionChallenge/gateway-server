import { Module } from '@nestjs/common';
import { VrResourceStorageRepository } from './cloud-storage/vr-resource-storage.repository';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CloudFunctionsRepository } from './cloud-functions/cloud-functions.repository';
import { VrVideoStorageRepository } from './cloud-storage/vr-video-storage.repository';
import { AiTaskQueueRepository } from './memorystore/ai-task-queue.repository';
import { RequestInfoRepository } from './firestore/repository/request-info.repository';
import { SampleAiTaskRequestRepository } from './firestore/repository/sample-ai-task-request.repository';
import { AiTaskRequestRepository } from './firestore/repository/ai-task-request.repository';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [
    VrResourceStorageRepository,
    CloudFunctionsRepository,
    VrVideoStorageRepository,
    AiTaskQueueRepository,
    AiTaskRequestRepository,
    RequestInfoRepository,
    SampleAiTaskRequestRepository,
  ],
  exports: [
    VrResourceStorageRepository,
    CloudFunctionsRepository,
    VrVideoStorageRepository,
    AiTaskQueueRepository,
    AiTaskRequestRepository,
    RequestInfoRepository,
    SampleAiTaskRequestRepository,
  ],
})
export class GcpModule {}
