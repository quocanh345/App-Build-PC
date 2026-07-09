import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { res: response, req: request } = ctx.getContext<{
      res: Response;
      req: Request;
    }>();

    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const result = await this.tokenService.validateToken(
        token.accessToken,
        token.refreshToken,
      );
      response.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      response.setHeader('X-Access-Token', result.accessToken);
      request['payload'] = result.payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  private extractTokenFromRequest(
    request: Request,
  ): { accessToken: string; refreshToken: string } | null {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return {
        accessToken: authHeader.slice(7),
        refreshToken: (request.cookies as Record<string, string>)[
          'refreshToken'
        ],
      };
    }
    return null;
  }
}

@Injectable()
export class LogOutAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req: request } = ctx.getContext<{ req: Request }>();

    const refreshToken = (request.cookies as Record<string, string>)[
      'refreshToken'
    ] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      request['payload'] =
        await this.tokenService.validateRefreshToken(refreshToken);
      return true;
    } catch {
      throw new UnauthorizedException('Refresh Token không hợp lệ');
    }
  }
}
