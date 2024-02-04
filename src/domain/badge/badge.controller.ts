import { Controller, Get, UseGuards, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guard/jwt-auth.guard';
import { AuthUser } from '../../common/auth/decorator/auth-user.decorator';
import { User } from '../user/entity/user.entity';
import { InitEnrollGuard } from 'src/common/auth/guard/init-enroll.guard';
import { CareRecipientGuard } from 'src/common/auth/guard/role.guard';
import { BadgeService } from './badge.service';

@ApiTags('Badge')
@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @ApiOperation({ summary: '뱃지 생성 요청(회상 요법이 끝나고 요청할 것)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, InitEnrollGuard, CareRecipientGuard)
  @Post('/')
  async giveBadge(@AuthUser() user: User): Promise<void> {
    return await this.badgeService.giveBadge(user);
  }

  @ApiOperation({
    summary: '뱃지 리스트 조회',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, InitEnrollGuard)
  @Get('/')
  async getBadgeList(@AuthUser() user: User): Promise<void> {
    return await this.badgeService.getBadgeList(user);
  }
}
