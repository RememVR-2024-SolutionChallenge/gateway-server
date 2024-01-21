import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/api/user/data/repository/main/user.repository';
import { User } from '../../user/data/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any, done: VerifiedCallback): Promise<void> {
    const { id, type } = payload;
    const user: User = await this.userRepository.findById(id);

    if (!user) {
      done(new UnauthorizedException('올바르지 않은 인증정보입니다.'), null);
    }
    if (type != 'access') {
      done(new UnauthorizedException('올바르지 않은 토큰의 종류입니다.'), null);
    }

    done(null, user);
  }
}
