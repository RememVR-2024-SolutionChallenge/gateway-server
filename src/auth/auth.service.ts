import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { RefreshTokenRequestDto } from './dto/request/refresh-token.request.dto';
import { RefreshTokenResponseDto } from './dto/response/refresh-token.response.dto';
import { GoogleAuthResponseDto } from './dto/response/google-auth.response.dto';
import { GoogleAuthProfileType } from './type/google-auth-profile.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async googleAuthCallback(req): Promise<GoogleAuthResponseDto> {
    if (!req.user)
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');

    const user: GoogleAuthProfileType = req.user;
    const exUser = await this.userRepository.findById(user.id);

    if (!exUser) {
      // 최초가입자인 경우 기본 데이터 저장 후,
      const newUser = new User();
      newUser.id = user.id;
      newUser.email = user.email;
      newUser.name = user.name;
      newUser.role = null;
      await this.userRepository.save(newUser);
    }

    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.updateRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
      isEnrolled: exUser ? exUser.isEnrolled : false,
    };
  }

  async refreshAccessToken(
    dto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = dto;
    // Verify refresh token
    // JWT Refresh Token 검증 로직
    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    // Check if user exists
    const userId = decodedRefreshToken.id;
    const user = await this.userRepository.findById(userId);

    if (user.refreshToken != refreshToken) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    return {
      accessToken: await this.generateAccessToken(user.id),
      refreshToken: await this.updateRefreshToken(user.id),
    };
  }

  async updateRefreshToken(id: string): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { id },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE },
    );
    console.log(refreshToken);
    await this.userRepository.updateRefreshToken(id, refreshToken);

    return refreshToken;
  }

  async generateAccessToken(id: string): Promise<string> {
    return await this.jwtService.signAsync(
      { id },
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE },
    );
  }
}
