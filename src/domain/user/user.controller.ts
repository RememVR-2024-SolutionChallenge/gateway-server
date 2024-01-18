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
import { JwtAuthGuard } from 'src/domain/auth/guard/jwt-auth.guard';
import { User } from './data/entity/user.entity';
import { AuthUser } from 'src/domain/auth/decorator/auth-user.decorator';
import { EnrollCareRequestDto } from './dto/request/enroll-care.reuqest.dto';

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

  @ApiOperation({
    summary: '최초가입자 환자-보호자 등록(1)',
    description: '인풋으로 피보호자의 이메일을 받아서 인증번호 발송',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/enroll/care/email')
  enrollCareEmail(
    @Body() enrollCareRequestDto: EnrollCareRequestDto,
    @AuthUser() user: User,
  ) {
    return this.userEnrollService.enrollCareEmail(enrollCareRequestDto, user);
  }

  // @ApiOperation({
  //   summary: '최초가입자 환자-보호자 등록(2)',
  //   description:
  //     '인풋으로 인증번호 받고, 확인 후에 케어관계 등록할 수 있도록 함',
  // })
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Post('/enroll/care/certificate')
  // enrollCareCert(@Body() nvjk, @AuthUser() user: User) {
  //   return;
  // }
}
