import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      ('user' | 'admin')[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<{ req: Request }>();
    const payload = req['payload'];
    return !!payload && requiredRoles.includes(payload.role);
  }
}
