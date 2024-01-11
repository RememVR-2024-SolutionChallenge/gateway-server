import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  googleAuthCallback(req) {
    if (!req.user)
      throw new UnauthorizedException('인증되지 않은 사용자입니다.');

    return { user: req.user };
  }
}
