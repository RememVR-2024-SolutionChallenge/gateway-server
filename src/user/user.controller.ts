import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { EnrollRequestDto } from './dto/request/enroll.request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '최초가입자 정보등록',
    description: '구글 OAuth2.0 인증 후, 최초가입자로 확인되면, 정보등록 필요',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  enroll(@Body() enrollRequestDto: EnrollRequestDto): Promise<void> {
    return this.userService.join(enrollRequestDto);
  }
}
