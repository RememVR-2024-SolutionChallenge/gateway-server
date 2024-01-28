import { Controller, Get, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service';
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
import { GetMyGroupReponseDto } from './dto/response/get-my-group.response.dto';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '내 케어 그룹 조회' })
  @ApiBearerAuth()
  @ApiResponse({ type: GetMyGroupReponseDto })
  @UseGuards(JwtAuthGuard, InitEnrollGuard)
  @Get('/')
  async getMyGroup(@AuthUser() user: User): Promise<GetMyGroupReponseDto> {
    const myGroup = await this.groupService.getMyGroup(user);
    return GetMyGroupReponseDto.of(myGroup);
  }
}
