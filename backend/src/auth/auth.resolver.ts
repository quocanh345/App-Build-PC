import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard, LogOutAuthGuard } from './auth.guard';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterAuthInput } from './dto/register.dto.input';
import { LoginAuthInput } from './dto/login.dto.input';
import { ForgotPasswordInput } from './dto/forgotPassword.dto.input';
import { ResetPasswordInput } from './dto/resetPassword.dto.input';
import { VerifyEmailInput } from './dto/verifyEmail.dto.input';
import { ResendVerificationEmailInput } from './dto/resendVerificationEmail.dto.input';
import { Auth } from './entities/auth.entity';
import { AuthBody, RefreshTokenBody } from './auth.type';
import type { tokenPayload } from './auth.type';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Trả thông tin tài khoản (email, phoneNumber) của người đang đăng nhập —
  // cần cho trang hồ sơ, vì JWT chỉ mang theo email chứ không có phoneNumber.
  @UseGuards(AuthGuard)
  @Query(() => Auth)
  async myAccount(@CurrentUser() user: tokenPayload): Promise<Auth> {
    return this.authService.getById(user.id);
  }

  @Mutation(() => AuthBody)
  async register(
    @Args('registerAuthInput') registerAuthInput: RegisterAuthInput,
    @Context() context: { res: Response },
  ): Promise<AuthBody> {
    const { auth, tokens } = await this.authService.register(registerAuthInput);
    context.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return { auth, accessToken: tokens.accessToken };
  }

  @Mutation(() => AuthBody)
  async login(
    @Args('loginAuthInput') loginAuthInput: LoginAuthInput,
    @Context() context: { res: Response },
  ): Promise<AuthBody> {
    const { auth, tokens } = await this.authService.login(loginAuthInput);
    context.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return { auth, accessToken: tokens.accessToken };
  }

  // Dùng khi frontend tải lại trang và mất accessToken trong bộ nhớ:
  // chỉ cần refreshToken (cookie httpOnly) vẫn còn hợp lệ là xin lại được accessToken mới.
  @Mutation(() => RefreshTokenBody)
  async refreshToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<RefreshTokenBody> {
    const refreshToken = (context.req.cookies as Record<string, string>)[
      'refreshToken'
    ];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refresh(refreshToken);
    context.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(LogOutAuthGuard)
  @Mutation(() => Boolean)
  async logout(
    @Context() context: { req: Request; res: Response },
  ): Promise<boolean> {
    const payload = context.req['payload'] as tokenPayload;
    await this.authService.logout(payload);
    context.res.clearCookie('refreshToken');
    return true;
  }

  @UseGuards(LogOutAuthGuard)
  @Mutation(() => Boolean)
  async removeAuth(
    @Context() context: { req: Request; res: Response },
  ): Promise<boolean> {
    const payload = context.req['payload'] as tokenPayload;
    await this.authService.remove(payload);
    context.res.clearCookie('refreshToken');
    return true;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ): Promise<boolean> {
    return this.authService.forgotPassword(forgotPasswordInput);
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ): Promise<boolean> {
    return this.authService.resetPassword(resetPasswordInput);
  }

  @Mutation(() => Boolean)
  async verifyEmail(
    @Args('verifyEmailInput') verifyEmailInput: VerifyEmailInput,
  ): Promise<boolean> {
    return this.authService.verifyEmail(verifyEmailInput);
  }

  @Mutation(() => Boolean)
  async resendVerificationEmail(
    @Args('resendVerificationEmailInput')
    resendVerificationEmailInput: ResendVerificationEmailInput,
  ): Promise<boolean> {
    return this.authService.resendVerificationEmail(
      resendVerificationEmailInput,
    );
  }
}
