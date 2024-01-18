import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err) throw err;

    if (!user) {
      // Check if JWT is expired
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          statusCode: 401,
          message: '만료된 JWT 토큰입니다.',
          error: 'Expired',
        });
      }
      throw new UnauthorizedException('올바르지 않은 JWT 토큰입니다.');
    }

    return user;
  }
}
