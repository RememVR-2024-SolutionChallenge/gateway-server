import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/api/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/api/auth/decorator/auth-user.decorator';
import { AiQueueService } from './service/ai-queue.service';
import { User } from '../user/data/entity/user.entity';
import { Queue3DgsTaskRequestDto } from './dto/request/queue-3dgs-task.request.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiQueueService: AiQueueService) {}

  @ApiOperation({
    summary: '배경, 아바타 생성(3DGS) 요청',
    description: '',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/3dgs')
  async Queue3DgsTask(
    @Body() requestDto: Queue3DgsTaskRequestDto,
    @AuthUser() user: User,
  ) {
    return this.aiQueueService.Queue3DgsTask(requestDto, user);
  }
}
