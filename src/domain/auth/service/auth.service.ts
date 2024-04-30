import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/domain/user/entity/user.entity';
import { UserRepository } from 'src/domain/user/repository/user.repository';
import { RefreshTokenRequestDto } from '../dto/request/refresh-token.request.dto';
import { RefreshTokenResponseDto } from '../dto/response/refresh-token.response.dto';
import { GoogleAuthResponseDto } from '../dto/response/google-auth.response.dto';
import { GoogleAuthProfileType } from '../type/google-auth-profile.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const userId = decodedRefreshToken.id;
    const user = await this.userRepository.findByIdWithRefreshToken(userId);
    if (!user || user.refreshToken != refreshToken) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    return {
      accessToken: await this.generateAccessToken(user.id),
      refreshToken: await this.updateRefreshToken(user.id),
    };
  }

  private async updateRefreshToken(id: string): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { id, type: 'refresh' },
      { expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRE') },
    );
    await this.userRepository.updateRefreshToken(id, refreshToken);

    return refreshToken;
  }

  private async generateAccessToken(id: string): Promise<string> {
    return await this.jwtService.signAsync(
      { id, type: 'access' },
      { expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRE') },
    );
  }
}
