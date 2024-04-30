import { Controller, Get, UseGuards, Post, Body, Query } from '@nestjs/common';
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
import { BadgeService } from './service/badge.service';
import { Badge } from './entity/badge.entity';
import { GetBadgeListResponseDto } from './dto/response/get-badge-list.request.dto';
import { ApiQuery } from '@nestjs/swagger';

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
  @ApiQuery({ name: 'year', type: Number, description: '조회할 년도' })
  @ApiQuery({ name: 'month', type: Number, description: '조회할 월' })
  @ApiBearerAuth()
  @ApiResponse({ type: GetBadgeListResponseDto })
  @UseGuards(JwtAuthGuard, InitEnrollGuard)
  @Get('/')
  async getBadgeList(
    @AuthUser() user: User,
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<GetBadgeListResponseDto> {
    const badgeList = await this.badgeService.getBadgeList(user, year, month);
    return GetBadgeListResponseDto.of(badgeList);
  }
}
