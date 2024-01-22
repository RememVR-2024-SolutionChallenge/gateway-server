import { Module } from '@nestjs/common';
import { GcpModule } from 'src/common/gcp/gcp.module';
import { AiController } from './ai.controller';
import { AiQueueService } from './service/ai-queue.service';

@Module({
  imports: [GcpModule],
  controllers: [AiController],
  providers: [AiQueueService],
})
export class AiModule {}
