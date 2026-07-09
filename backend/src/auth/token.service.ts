import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { tokenPayload, AuthToken } from './auth.type';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { randomUUID as uuid } from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async generateToken(payload: tokenPayload): Promise<AuthToken> {
    const accessTokenId = uuid();
    const refreshTokenId = uuid();
    const accessToken = await this.jwtService.signAsync(
      { ...payload, tokenId: accessTokenId },
      {
        secret: process.env.JWT_SECRET || 'default_secret_key',
        expiresIn: '1h',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { ...payload, tokenId: refreshTokenId },
      {
        secret: process.env.REFRESH_SECRET || 'not_default_secret_key',
        expiresIn: '7d',
      },
    );
    await this.redis.set(
      `refreshToken:${refreshTokenId}`,
      payload.id,
      'EX',
      7 * 24 * 60 * 60,
    );
    return { accessToken, refreshToken, payload };
  }

  async validateToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<AuthToken> {
    if (!accessToken || !refreshToken) {
      throw new Error('Access Token hoặc Refresh Token không được cung cấp');
    }
    try {
      const payload: tokenPayload = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: process.env.JWT_SECRET || 'default_secret_key',
        },
      );
      return { accessToken, refreshToken, payload };
    } catch (error) {
      console.error('Error validating access token:', error);
      if (error.name === 'TokenExpiredError') {
        return this.renewByRefreshToken(refreshToken);
      } else {
        throw new Error('Token không hợp lệ');
      }
    }
  }

  async validateRefreshToken(refreshToken: string): Promise<tokenPayload> {
    try {
      const payload: tokenPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.REFRESH_SECRET || 'not_default_secret_key',
        },
      );
      return payload;
    } catch (error) {
      console.error('Error validating refresh token:', error);
      throw new Error('Refresh Token không hợp lệ');
    }
  }

  async renewByRefreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      const payload: tokenPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.REFRESH_SECRET || 'not_default_secret_key',
        },
      );
      const result = await this.redis.get(`refreshToken:${payload.tokenId}`);
      if (!result) {
        throw new Error('Refresh Token không hợp lệ');
      }
      await this.redis.del(`refreshToken:${payload.tokenId}`);
      // payload giải mã từ JWT có sẵn exp/iat/tokenId — phải làm sạch trước khi
      // ký lại, nếu không jsonwebtoken sẽ báo lỗi xung đột với option expiresIn.
      return this.generateToken({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
    } catch (error) {
      console.error('Error renewing token:', error);
      throw new Error('Refresh Token không hợp lệ');
    }
  }

  async revokeRefreshToken(uuid: string): Promise<void> {
    try {
      await this.redis.del(`refreshToken:${uuid}`);
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      throw new Error('Refresh Token không hợp lệ');
    }
  }

  // Token quên mật khẩu là một chuỗi ngẫu nhiên độc lập với JWT (không mang
  // thông tin, không thể giả mạo/giải mã), sống ngắn hạn trong Redis và bị xoá
  // ngay sau khi dùng để không thể tái sử dụng.
  async generateResetPasswordToken(authId: string): Promise<string> {
    const resetToken = uuid();
    await this.redis.set(
      `resetPassword:${resetToken}`,
      authId,
      'EX',
      15 * 60,
    );
    return resetToken;
  }

  async consumeResetPasswordToken(resetToken: string): Promise<string | null> {
    const authId = await this.redis.get(`resetPassword:${resetToken}`);
    if (!authId) return null;
    await this.redis.del(`resetPassword:${resetToken}`);
    return authId;
  }

  // Cùng cơ chế với token quên mật khẩu, nhưng sống lâu hơn (24h) vì email xác
  // thực ít khẩn cấp hơn và người dùng có thể mở nó trễ.
  async generateEmailVerificationToken(authId: string): Promise<string> {
    const verifyToken = uuid();
    await this.redis.set(
      `verifyEmail:${verifyToken}`,
      authId,
      'EX',
      24 * 60 * 60,
    );
    return verifyToken;
  }

  async consumeEmailVerificationToken(
    verifyToken: string,
  ): Promise<string | null> {
    const authId = await this.redis.get(`verifyEmail:${verifyToken}`);
    if (!authId) return null;
    await this.redis.del(`verifyEmail:${verifyToken}`);
    return authId;
  }
}
