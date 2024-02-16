import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { VrResourceQueueService } from './service/vr-resource-queue.service';
import { User } from '../user/entity/user.entity';
import { QueueAiTaskRequestDto } from './dto/request/queue-ai-task.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { InitEnrollGuard } from 'src/common/auth/guard/init-enroll.guard';
import { CareGiverGuard } from 'src/common/auth/guard/role.guard';
import { GetAiTaskQueueResponseDto } from './dto/response/get-ai-task-queue.response.dto';
import { VrResourceService } from './service/vr-resource.service';
import { GetVrResourcesResponseDto } from './dto/response/get-vr-resources.response.dto';

@ApiTags('VR-resource')
@Controller('vr-resource')
export class VrResourceController {
  constructor(
    private readonly vrResourceQueueService: VrResourceQueueService,
    private readonly vrResourceService: VrResourceService,
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
  async queueAiTask(
    @UploadedFile() video: Express.Multer.File,
    @Body() requestDto: QueueAiTaskRequestDto,
    @AuthUser() user: User,
  ) {
    requestDto.validateType();
    return this.vrResourceQueueService.queueAiTask(requestDto, video, user);
  }

  @ApiOperation({
    summary: '완성된 VR 자원(배경, 아바타) 불러오기',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: [GetVrResourcesResponseDto] })
  @UseGuards(JwtAuthGuard, InitEnrollGuard)
  @Get('/')
  async getVrResources(
    @AuthUser() user: User,
  ): Promise<GetVrResourcesResponseDto> {
    const vrResourceList = await this.vrResourceService.getVrResources(user);
    return GetVrResourcesResponseDto.of(vrResourceList);
  }

  @ApiOperation({
    summary: 'AI 작업(배경, 아바타 생성) 대기 목록 확인',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: [GetAiTaskQueueResponseDto] })
  @UseGuards(JwtAuthGuard, InitEnrollGuard)
  @Get('/queue')
  async getAiTaskQueue(
    @AuthUser() user: User,
  ): Promise<GetAiTaskQueueResponseDto[]> {
    const queue = await this.vrResourceQueueService.getAiTaskQueue(user);
    return queue.map((item) => GetAiTaskQueueResponseDto.of(item));
  }
}
