import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async googleAuthCallback(req) {
    if (!req.user)
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');

    const { user } = req;
    if (await this.userRepository.findById(user.id)) {
      // accessToken, refreshToken 부여
      return {
        accessToken: this.generateAccessToken(user.id),
        refreshToken: this.generateRefreshToken(user.id),
      };
    } else {
      // 최초가입자임을 client에 알리기
      return { accessToken: null, refreshToken: null };
    }
  }

  async generateRefreshToken(id: String) {
    const refreshToken = await this.jwtService.signAsync(
      { id },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE },
    );

    return await this.userRepository.updateRefreshToken(id, refreshToken);
  }

  async generateAccessToken(id: String) {
    return await this.jwtService.signAsync(
      { id },
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE },
    );
  }
}
