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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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
    description:
      '서버 내부적으로 사용하는 API입니다. 프론트단에서는 접근하지 마세요.',
  })
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthCallback(@Req() req: Request) {
    // (2) get user info from google
    return this.authService.googleAuthCallback(req);
  }
}
