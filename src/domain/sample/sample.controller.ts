import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
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
import { SampleVrResourceService } from './service/sample-vr-resource.service';
import { SampleGenerateSceneRequestDto } from './dto/request/sample-generate-scene.request.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { SampleGenerateAvatarRequestDto } from './dto/request/sample-generate-avatar.request.dto';
import { SampleGetVrResourcesRequestDto } from './dto/request/sample-get-vr-resource.request.dto';
import { ConfigService } from '@nestjs/config';
import { SampleGetVrVideosRequestDto } from './dto/request/sample-get-vr-video.request.dto';
import { GetVrVideosResponseDto } from '../vr-video/dto/response/get-vr-videos.response.dto';
import { GetVrResourcesResponseDto } from '../vr-resource/dto/response/get-vr-resources.response.dto';
import { VrVideoService } from '../vr-video/service/vr-video.service';
import { SampleGenerateVideoRequestDto } from './dto/request/sample-generate-video.request.dto';

@ApiTags('Sample')
@Controller('/sample')
export class SampleController {
  private adminKey: string;

  constructor(
    private readonly sampleVrResourceService: SampleVrResourceService,
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
    return this.sampleVrResourceService.generateScene(requestDto, video);
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
    return this.sampleVrResourceService.generateAvatar(
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
    @Body() requestDto: SampleGetVrResourcesRequestDto,
  ): Promise<GetVrResourcesResponseDto> {
    this.validateAdminKey(requestDto.key);
    return new GetVrResourcesResponseDto(
      await this.sampleVrResourceService.getVrResources(),
    );
  }

  @ApiOperation({ summary: '샘플 VR 비디오 찾기' })
  @ApiResponse({ type: GetVrVideosResponseDto })
  @Get('/vr-video')
  async getSampleVrVideos(
    @Body() requestDto: SampleGetVrVideosRequestDto,
  ): Promise<GetVrVideosResponseDto[]> {
    this.validateAdminKey(requestDto.key);
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
