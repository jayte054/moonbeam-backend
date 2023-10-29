import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';
import { AuthEntity } from '../authEntity/authEntity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): AuthEntity | AdminAuthEntity => {
    const req = ctx.switchToHttp().getRequest();
    console.log(data);
    console.log('request', req.user);
    return req.user || req.admin;
  },
);
