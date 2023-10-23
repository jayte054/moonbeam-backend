import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminAuthEntity } from '../adminAuthEntity/adminAuthEntity';

export const GetAdmin = createParamDecorator(
  (data, ctx: ExecutionContext): AdminAuthEntity => {
    const req = ctx.switchToHttp().getRequest();
    console.log(`data: ${data}`);
    console.log(`Request context: ${req.admin}`);
    return req.admin;
  },
);
