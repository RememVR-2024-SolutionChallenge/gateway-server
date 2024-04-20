import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { SampleController } from './sample.controller';
import { SampleAiTaskRequestRepository } from './repository/sample-ai-task-request.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiTaskQueueRepository } from './repository/ai-task-queue.repository';
import { SampleVrResourceService } from './service/sample-vr-resource.service';
import { SampleVrResourceRepository } from './repository/sample-vr-resource.repository';
import { SampleVrResource } from './entity/sample-vr-resource.entity';
import { RequestInfoRepository } from './repository/request-info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SampleVrResource]), GcpModule],
  controllers: [SampleController],
  providers: [
    SampleAiTaskRequestRepository,
    AiTaskQueueRepository,
    SampleVrResourceService,
    SampleVrResourceRepository,
    RequestInfoRepository,
  ],
  exports: [
    SampleVrResourceService,
    RequestInfoRepository,
    AiTaskQueueRepository,
  ],
})
export class SampleModule {}
