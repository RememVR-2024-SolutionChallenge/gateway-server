import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from '../user/entity/user.entity';
import { InitEnrollGuard } from 'src/common/auth/guard/init-enroll.guard';
import { CareGiverGuard } from 'src/common/auth/guard/role.guard';
import { VrVideoService } from './service/vr-video.service';
import { GenerateVrVideoRequestDto } from './dto/request/generate-vr-video.request.dto';
import { GetVrVideosResponseDto } from './dto/response/get-vr-videos.response.dto';

@ApiTags('VR-video')
@Controller('vr-video')
export class VrVideoController {
  constructor(private readonly vrVideoService: VrVideoService) {}

  /**
   *
   * @param user userID
   * @param requestDto scene 1, avatars 1~10
   */
  @ApiOperation({ summary: 'VR 비디오 생성 요청' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, InitEnrollGuard, CareGiverGuard)
  @Post('/')
  async generateVrVideo(
    @AuthUser() user: User,
    @Body() requestDto: GenerateVrVideoRequestDto,
  ): Promise<void> {
    return await this.vrVideoService.generateVrVideo(user, requestDto);
  }

  @ApiOperation({ summary: 'VR 비디오 정보 불러오기' })
  @ApiBearerAuth()
  @ApiResponse({ type: [GetVrVideosResponseDto] })
  @UseGuards(JwtAuthGuard, InitEnrollGuard)
  @Get('/')
  async getVrVideos(@AuthUser() user: User): Promise<GetVrVideosResponseDto[]> {
    return await this.vrVideoService.getVrVideos(user);
  }

  // 특정 VR 비디오 id를 통해서 특정한 VR비디오 정보를 불러오는 API를 작성할것.
  @ApiOperation({ summary: 'VR 비디오 정보 불러오기' })
  @ApiBearerAuth()
  @ApiResponse({ type: GetVrVideosResponseDto })
  @UseGuards(JwtAuthGuard, InitEnrollGuard)
  @Get('/:id')
  async getVrVideo(
    @AuthUser() user: User,
    @Param('id') videoId: string,
  ): Promise<GetVrVideosResponseDto> {
    return await this.vrVideoService.getVrVideo(user, videoId);
  }
}
