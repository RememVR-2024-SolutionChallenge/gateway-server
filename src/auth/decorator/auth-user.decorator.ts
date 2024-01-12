import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const context = ctx.switchToHttp().getRequest();

  return context.user;
});
