import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  UploadedFiles,
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
import { GenerateSceneRequestDto } from './dto/request/generate-scene.request.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { InitEnrollGuard } from 'src/common/auth/guard/init-enroll.guard';
import { CareGiverGuard } from 'src/common/auth/guard/role.guard';
import { GetAiTaskQueueResponseDto } from './dto/response/get-ai-task-queue.response.dto';
import { VrResourceService } from './service/vr-resource.service';
import { GetVrResourcesResponseDto } from './dto/response/get-vr-resources.response.dto';
import { GenerateAvatarRequestDto } from './dto/request/generate-avatar.request.dto';
import { SampleVrResourceService } from '../sample/service/sample-vr-resource.service';

@ApiTags('VR-resource')
@Controller('vr-resource')
export class VrResourceController {
  constructor(
    private readonly vrResourceQueueService: VrResourceQueueService,
    private readonly vrResourceService: VrResourceService,
  ) {}

  @ApiOperation({
    summary: '배경 생성 요청',
    description: '요청 시에 AI서버 쪽 큐(Queue)에 등록',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: GenerateSceneRequestDto })
  @UseGuards(JwtAuthGuard, InitEnrollGuard, CareGiverGuard)
  @Post('/scene')
  @UseInterceptors(FileInterceptor('video'))
  async generateScene(
    @UploadedFile() video: Express.Multer.File,
    @Body() requestDto: GenerateSceneRequestDto,
    @AuthUser() user: User,
  ) {
    return this.vrResourceQueueService.generateScene(requestDto, video, user);
  }

  @ApiOperation({
    summary: '아바타 생성 요청',
    description: '요청 시에 AI서버 쪽 큐(Queue)에 등록',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: GenerateAvatarRequestDto })
  @UseGuards(JwtAuthGuard, InitEnrollGuard, CareGiverGuard)
  @Post('/avatar')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'body', maxCount: 1 },
      { name: 'face', maxCount: 1 },
    ]),
  )
  async generateAvatar(
    @UploadedFiles()
    files: { face: Express.Multer.File[]; body: Express.Multer.File[] },
    @Body() requestDto: GenerateAvatarRequestDto,
    @AuthUser() user: User,
  ) {
    return this.vrResourceQueueService.generateAvatar(
      requestDto,
      files.face[0],
      files.body[0],
      user,
    );
  }

  @ApiOperation({
    summary: '완성된 VR 자원 불러오기 (샘플 포함)',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: GetVrResourcesResponseDto })
  @UseGuards(JwtAuthGuard, InitEnrollGuard)
  @Get('/')
  async getVrResources(
    @AuthUser() user: User,
  ): Promise<GetVrResourcesResponseDto> {
    const vrResourceDtos = await this.vrResourceService.getVrResources(user);
    return new GetVrResourcesResponseDto(vrResourceDtos);
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
