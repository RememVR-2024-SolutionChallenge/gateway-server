import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guard/jwt-auth.guard';
import { AuthUser } from '../../common/auth/decorator/auth-user.decorator';
import { User } from '../user/entity/user.entity';

@ApiTags('Group')
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: '내 케어 그룹 조회' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getMyGroup(@AuthUser() user: User) {
    return this.groupService.getMyGroup(user);
  }
}
