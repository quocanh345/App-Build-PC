import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { tokenPayload } from './auth.type';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): tokenPayload => {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<{
      req: Request & { payload: tokenPayload };
    }>();
    return req.payload;
  },
);
