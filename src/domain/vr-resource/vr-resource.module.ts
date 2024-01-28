import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { VrResourceController } from './vr-resource.controller';
import { VrResourceQueueService } from './service/vr-resource-queue.service';
import { AiTaskRequestRepository } from './repository/ai-task-request.repository';

// 3DGS(*3D-Gaussian Splatting) 이라는 용어는 gateway서버에서는 사용하지 않기.
// 변수명 앞에 3dgs를 넣을 수 없는 이슈로 추상화를 적용해서 AI로 언급.
@Module({
  imports: [GcpModule],
  controllers: [VrResourceController],
  providers: [VrResourceQueueService, AiTaskRequestRepository],
})
export class VrResourceModule {}
