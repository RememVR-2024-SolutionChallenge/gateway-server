import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any): Promise<any> {
    const { id, exp } = payload;
    const user = this.userRepository.findById(id);

    if (!user) {
      throw new UnauthorizedException('올바르지 않은 JWT 토큰입니다.');
    }
    if (exp < Date.now()) {
      throw new UnauthorizedException({
        message: '만료된 JWT 토큰입니다.',
        error: 'expired',
      });
    }

    return user;
  }
}
