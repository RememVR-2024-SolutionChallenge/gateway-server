import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserEnrollService } from './service/user-enroll.service';
import { EnrollInfoRequestDto } from './dto/request/enroll-info.request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from './entity/user.entity';
import { AuthUser } from 'src/auth/decorator/auth-user.decorator';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private readonly userEnrollService: UserEnrollService) {}

  @ApiOperation({
    summary: '최초가입자 정보등록',
    description: '구글 OAuth2.0 인증 후, 최초가입자로 확인되면, 정보등록 필요',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/enroll/info')
  enrollInfo(
    @Body() enrollInfoRequestDto: EnrollInfoRequestDto,
    @AuthUser() user: User,
  ): Promise<void> {
    enrollInfoRequestDto.validateRole();
    return this.userEnrollService.enrollInfo(enrollInfoRequestDto, user);
  }

  // @ApiOperation({
  //   summary: '최초가입자 환자-보호자 등록',
  //   description: '이메일 인증 후, 보호자-환자 연결',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/enroll/care')
  // enrollCareRecipient(@Body() nvjk, @AuthUser() user: User) {}
}
