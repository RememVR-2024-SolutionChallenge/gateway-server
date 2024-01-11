import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthResponseDto } from './dto/response/google-auth.response.dto';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '구글 OAuth2.0 인증',
    description: '프론트에서는 이 api에 접근해야 합니다.',
  })
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() {
    // (1) redirect google login page
  }

  @ApiOperation({
    summary: '구글 OAuth2.0 인증',
    description: '프론트에 응답을 보내는 엔드포인트입니다.',
  })
  @ApiResponse({
    description:
      '최초가입자와 기가입자는 isEnrolled 필드로 구분할 수 있습니다.',
    type: GoogleAuthResponseDto,
  })
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request) {
    // (2) get user info from google
    return this.authService.googleAuthCallback(req);
  }
}
