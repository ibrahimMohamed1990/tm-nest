import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// يجيب المستخدم الحالي اللي حطه الـ AuthGuard في الـ request
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
});
