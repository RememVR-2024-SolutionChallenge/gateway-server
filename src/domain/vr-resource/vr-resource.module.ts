import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VrResourceController } from './vr-resource.controller';
import { VrResourceQueueService } from './service/vr-resource-queue.service';
import { AiTaskRequestRepository } from './repository/ai-task-request.repository';
import { VrResourceService } from './service/vr-resource.service';
import { VrResourceRepository } from './repository/vr-resource.repository';
import { VrResource } from './entity/vr-resource.entity';

import { GcpModule } from 'src/common/gcp/gcp.module';
import { SampleModule } from '../sample/sample.module';
import { GroupModule } from '../group/group.module';

import { Group } from '../group/entity/group.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User, VrResource]),
    GcpModule,
    SampleModule,
    GroupModule,
  ],
  controllers: [VrResourceController],
  providers: [
    VrResourceQueueService,
    AiTaskRequestRepository,
    VrResourceService,
    VrResourceRepository,
  ],
  exports: [VrResourceRepository],
})
export class VrResourceModule {}
