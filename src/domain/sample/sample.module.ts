import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { SampleController } from './sample.controller';
import { SampleAiTaskRequestRepository } from './repository/sample-ai-task-request.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiTaskQueueRepository } from '../vr-resource/repository/ai-task-queue.repository';
import { SampleVrResourceService } from './service/sample-vr-resource.service';
import { SampleVrResourceRepository } from './repository/sample-vr-resource.repository';
import { SampleVrResource } from './entity/sample-vr-resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SampleVrResource]), GcpModule],
  controllers: [SampleController],
  providers: [
    SampleAiTaskRequestRepository,
    AiTaskQueueRepository,
    SampleVrResourceService,
    SampleVrResourceRepository,
  ],
})
export class SampleModule {}
