import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { VrResourceController } from './vr-resource.controller';
import { VrResourceQueueService } from './service/vr-resource-queue.service';
import { AiTaskRequestRepository } from './repository/ai-task-request.repository';
import { GroupService } from '../group/group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/entity/group.entity';
import { User } from '../user/entity/user.entity';
import { GroupRepository } from '../group/repository/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User]), GcpModule],
  controllers: [VrResourceController],
  providers: [
    VrResourceQueueService,
    AiTaskRequestRepository,
    GroupService,
    GroupRepository,
  ],
})
export class VrResourceModule {}
