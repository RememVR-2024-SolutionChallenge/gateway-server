import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SampleGenerateSceneRequestDto } from './dto/request/sample-generate-scene.request.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { SampleGenerateAvatarRequestDto } from './dto/request/sample-generate-avatar.request.dto';
import { ConfigService } from '@nestjs/config';
import { GetVrVideosResponseDto } from '../vr-video/dto/response/get-vr-videos.response.dto';
import { GetVrResourcesResponseDto } from '../vr-resource/dto/response/get-vr-resources.response.dto';
import { VrVideoService } from '../vr-video/service/vr-video.service';
import { SampleGenerateVideoRequestDto } from './dto/request/sample-generate-video.request.dto';
import { VrResourceService } from '../vr-resource/service/vr-resource.service';
import { VrResourceQueueService } from '../vr-resource/service/vr-resource-queue.service';

@ApiTags('Sample')
@Controller('/sample')
export class SampleController {
  private adminKey: string;

  constructor(
    private readonly vrResourceService: VrResourceService,
    private readonly vrResourceQueueService: VrResourceQueueService,
    private readonly configService: ConfigService,
    private readonly vrVideoService: VrVideoService,
  ) {
    this.adminKey = this.configService.get<string>('ADMIN_KEY');
  }

  @ApiOperation({ summary: '유저 샘플 배경 생성 요청' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SampleGenerateSceneRequestDto })
  @Post('/scene')
  @UseInterceptors(FileInterceptor('video'))
  async generateScene(
    @UploadedFile() video: Express.Multer.File,
    @Body() requestDto: SampleGenerateSceneRequestDto,
  ) {
    this.validateAdminKey(requestDto.key);
    return this.vrResourceQueueService.generateSampleScene(requestDto, video);
  }

  @ApiOperation({ summary: '아바타 생성 요청' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SampleGenerateAvatarRequestDto })
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
    @Body() requestDto: SampleGenerateAvatarRequestDto,
  ) {
    this.validateAdminKey(requestDto.key);
    return this.vrResourceQueueService.generateSampleAvatar(
      requestDto,
      files.face[0],
      files.body[0],
    );
  }

  @ApiOperation({ summary: '샘플 VR 자원 찾기' })
  @ApiResponse({
    status: 200,
    type: GetVrResourcesResponseDto,
  })
  @Get('/vr-resource')
  async getVrResources(
    @Query('key') key: string,
  ): Promise<GetVrResourcesResponseDto> {
    this.validateAdminKey(key);
    return new GetVrResourcesResponseDto(
      await this.vrResourceService.getSampleVrResources(),
    );
  }

  /* -------------------------------------------------------------------------- */

  @ApiOperation({ summary: '샘플 VR 비디오 찾기' })
  @ApiResponse({ type: GetVrVideosResponseDto })
  @Get('/vr-video')
  async getSampleVrVideos(
    @Query('key') key: string,
  ): Promise<GetVrVideosResponseDto[]> {
    this.validateAdminKey(key);
    return this.vrVideoService.getSampleVrVideos();
  }

  @ApiOperation({ summary: '샘플 VR 비디오 만들기' })
  @Post('/vr-video')
  async getVrVideos(@Body() requestDto: SampleGenerateVideoRequestDto) {
    this.validateAdminKey(requestDto.key);
    return this.vrVideoService.generateSampleVrVideo(requestDto, true);
  }

  /* -------------------------------------------------------------------------- */
  // ! TODO: make as decorator
  validateAdminKey(key: string) {
    if (key !== this.adminKey) {
      throw new ForbiddenException('관리자만 접근할 수 있습니다.');
    }
  }
}
