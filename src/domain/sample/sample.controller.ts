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
import { SampleGetVrResourcesResponseDto } from './dto/response/sample-get-vr-resources.response.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Sample')
@Controller('/sample')
export class SampleController {
  private adminKey: string;

  constructor(
    private readonly sampleVrResourceService: SampleVrResourceService,
    private readonly configService: ConfigService,
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

  @ApiOperation({ summary: '완성된 VR 자원(배경, 아바타) 불러오기' })
  @Get('/')
  async getVrResources(
    @Body() requestDto: SampleGetVrResourcesRequestDto,
  ): Promise<SampleGetVrResourcesResponseDto> {
    this.validateAdminKey(requestDto.key);
    return new SampleGetVrResourcesResponseDto(
      await this.sampleVrResourceService.getVrResources(),
    );
  }

  // ! TODO: make as decorator
  validateAdminKey(key: string) {
    if (key !== this.adminKey) {
      throw new ForbiddenException('관리자만 접근할 수 있습니다.');
    }
  }
}
