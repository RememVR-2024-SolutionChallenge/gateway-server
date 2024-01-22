import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/api/auth/decorator/auth-user.decorator';
import { AiQueueService } from './service/ai-queue.service';
import { User } from '../user/data/entity/user.entity';
import { QueueAiTaskRequestDto } from './dto/request/queue-ai-task.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiQueueService: AiQueueService) {}

  @ApiOperation({
    summary: '배경, 아바타 생성 요청',
    description: '요청 시에 AI서버 쪽 큐(Queue)에 등록',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/source')
  @UseInterceptors(FileInterceptor('video'))
  async QueueAiTask(
    @Body() requestDto: QueueAiTaskRequestDto,
    @AuthUser() user: User,
  ) {
    requestDto.validateType();
    return this.aiQueueService.queueAiTask(requestDto, user);
  }
}
