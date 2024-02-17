import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/auth/decorator/auth-user.decorator';
import { User } from '../user/entity/user.entity';
import { InitEnrollGuard } from 'src/common/auth/guard/init-enroll.guard';
import { CareGiverGuard } from 'src/common/auth/guard/role.guard';
import { VrVideoService } from './service/vr-video.service';
import { GenerateVrVideoRequestDto } from './dto/request/generate-vr-video.request.dto';

@ApiTags('VR-video')
@Controller('vr-video')
export class VrVideoController {
  constructor(private readonly vrVideoService: VrVideoService) {}

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
}
