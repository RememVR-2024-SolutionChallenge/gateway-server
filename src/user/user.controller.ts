import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { JoinRequestDto } from './dto/request/join.request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary:
      '가입(구글 인증 후, DB에 없는 이메일인 경우에는 최초 회원가입 필요)',
  })
  @Post()
  join(@Body() joinRequestDto: JoinRequestDto) {
    return this.userService.join(joinRequestDto);
  }
}
