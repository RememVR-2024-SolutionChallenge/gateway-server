import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CareGiverGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(request);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.role != 'CareGiver') {
      throw new ForbiddenException('보호자만 접근할 수 있습니다.');
    }

    return user;
  }
}
