import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { RefreshTokenRequestDto } from './dto/request/refresh-token.request.dto';
import { RefreshTokenResponseDto } from './dto/response/refresh-token.response.dto';

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
      // 기가입자인 경우
      // 바로 access, refresh Token 부여
      return {
        accessToken: await this.generateAccessToken(user.id),
        refreshToken: await this.generateRefreshToken(user.id),
        isEnrolled: true,
      };
    } else {
      // 최초가입자인 경우
      // 기본 데이터 저장 후,
      const newUser = new User();
      newUser.id = user.id;
      newUser.email = user.email;
      newUser.name = user.name;
      newUser.role = null;
      await this.userRepository.save(newUser);
      // access, refresh Token 생성 및 isEnrolled에 false 처리 후 부여
      return {
        accessToken: await this.generateAccessToken(user.id),
        refreshToken: await this.generateRefreshToken(user.id),
        isEnrolled: false,
      };
    }
  }

  async refreshAccessToken(
    dto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = dto;

    /*
    // Verify refresh token
    // JWT Refresh Token 검증 로직
    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    // Check if user exists
    const userId = decodedRefreshToken.id;
    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      userId,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid user!');
    }

    return {
      accessToken: await this.generateAccessToken(user.id),
      refreshToken: await this.generateRefreshToken(user.id),
    };
    */
  }

  async generateRefreshToken(id: string): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { id },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE },
    );
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
