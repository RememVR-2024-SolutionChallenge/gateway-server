import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UserEnrollService } from './service/user-enroll.service';
import { EnrollInfoRequestDto } from './dto/request/enroll-info.request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/domain/auth/guard/jwt-auth.guard';
import { User } from './data/entity/user.entity';
import { AuthUser } from 'src/domain/auth/decorator/auth-user.decorator';
import { EnrollCareEmailRequestDto } from './dto/request/enroll-care-email.reuqest.dto';
import { EnrollCareCertRequestDto } from './dto/request/enroll-care-cert.request.dto';

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
    if (user.isEnrolled)
      throw new ForbiddenException('이미 정보 등록이 완료된 사용자입니다.');
    enrollInfoRequestDto.validateRole();
    return this.userEnrollService.enrollInfo(enrollInfoRequestDto, user);
  }

  @ApiOperation({
    summary: '최초가입자 환자-보호자 등록(1): 이메일 발송',
    description: '연결하기 위해 피보호자의 이메일로 인증번호 발송',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/enroll/care/email')
  enrollCareEmail(
    @Body() enrollCareEmailRequestDto: EnrollCareEmailRequestDto,
    @AuthUser() user: User,
  ): Promise<void> {
    if (user.isEnrolled)
      throw new ForbiddenException('이미 정보 등록이 완료된 사용자입니다.');
    return this.userEnrollService.enrollCareEmail(
      enrollCareEmailRequestDto,
      user,
    );
  }

  @ApiOperation({
    summary: '최초가입자 환자-보호자 등록(2): 인증번호 인증',
    description: '인증번호 확인 후, 케어관계 등록',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/enroll/care/certificate')
  enrollCareCert(
    @Body() enrollCareCertRequestDto: EnrollCareCertRequestDto,
    @AuthUser() user: User,
  ): Promise<void> {
    if (user.isEnrolled)
      throw new ForbiddenException('이미 정보 등록이 완료된 사용자입니다.');
    return this.userEnrollService.enrollCareCert(
      enrollCareCertRequestDto,
      user,
    );
  }
}
