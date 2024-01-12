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
import { GoogleAuthResponseDto } from './dto/response/google-auth.response.dto';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { RefreshTokenRequestDto } from './dto/request/refresh-token.request.dto';
import { RefreshTokenResponseDto } from './dto/response/refresh-token.response.dto';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '구글 OAuth2.0 인증',
    description: '프론트에서는 이 api에 접근해야 합니다.',
  })
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  // (1) redirect google login page
  async googleAuth() {}

  @ApiOperation({
    summary: '구글 OAuth2.0 인증',
    description: '프론트에 응답을 보내는 엔드포인트입니다.',
  })
  @ApiResponse({
    description:
      '최초가입자와 기가입자는 isEnrolled 필드로 구분할 수 있습니다.',
    type: GoogleAuthResponseDto,
  })
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  // (2) get user info from google
  async googleAuthCallback(
    @Req() req: Request,
  ): Promise<GoogleAuthResponseDto> {
    // 기가입자, 최초가입자 구분 후
    // access 및 refresh token 부여
    return this.authService.googleAuthCallback(req);
  }

  @ApiOperation({
    summary: 'access token이 만료된 경우, refresh token을 이용해서 재발급',
    description: 'access token과 refresh token모두 재발급합니다.',
  })
  @ApiResponse({
    description: '재발급된 access/refresh token.',
    type: RefreshTokenResponseDto,
  })
  @Post('refresh/')
  async refreshAccessToken(
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshAccessToken(dto);
  }
}
