import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { VrResourceQueueService } from './service/vr-resource-queue.service';
import { User } from '../user/entity/user.entity';
import { QueueAiTaskRequestDto } from './dto/request/queue-ai-task.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { InitEnrollGuard } from 'src/common/auth/guard/init-enroll.guard';
import { CareGiverGuard } from 'src/common/auth/guard/care-giver.guard';

@ApiTags('Vr-resource')
@Controller('vr-resource')
export class VrResourceController {
  constructor(
    private readonly vrResourceQueueService: VrResourceQueueService,
  ) {}

  @ApiOperation({
    summary: '배경, 아바타 생성 요청',
    description: '요청 시에 AI서버 쪽 큐(Queue)에 등록',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: QueueAiTaskRequestDto })
  @UseGuards(JwtAuthGuard, InitEnrollGuard, CareGiverGuard)
  @Post('/source')
  @UseInterceptors(FileInterceptor('video'))
  async QueueAiTask(
    @UploadedFile() video: Express.Multer.File,
    @Body() requestDto: QueueAiTaskRequestDto,
    @AuthUser() user: User,
  ) {
    requestDto.validateType();
    return this.vrResourceQueueService.queueAiTask(requestDto, video, user);
  }
}
