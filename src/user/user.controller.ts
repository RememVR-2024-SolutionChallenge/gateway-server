import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JoinRequestDto } from './dto/request/join.request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '최초 회원 가입',
    description:
      '(구글 OAuth2.0 인증 후[1], DB에 해당 유저 존재 확인 후[2], 존재하지 않는 경우에[3], 최초 회원가입 필요[4])',
  })
  @Post()
  join(@Body() joinRequestDto: JoinRequestDto) {
    return this.userService.join(joinRequestDto);
  }
}
