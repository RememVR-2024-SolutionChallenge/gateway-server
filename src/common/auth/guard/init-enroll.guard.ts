import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class InitEnrollGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      user.isEnrolled != true ||
      (user.role != 'CareGiver' && user.role != 'CareRecipient')
    ) {
      throw new ForbiddenException('정보등록 후 사용하실 수 있습니다.');
    }

    return user;
  }
}

@Injectable()
export class NotInitEnrollGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.isEnrolled == true) {
      throw new ForbiddenException('이미 정보 등록이 완료된 사용자입니다.');
    }

    return user;
  }
}
