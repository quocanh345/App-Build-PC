import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repositories';
import { Auth } from './entities/auth.entity';
import { AuthOutPut, tokenPayload } from './auth.type';
import { RegisterAuthInput } from './dto/register.dto.input';
import { LoginAuthInput } from './dto/login.dto.input';
import { ForgotPasswordInput } from './dto/forgotPassword.dto.input';
import { ResetPasswordInput } from './dto/resetPassword.dto.input';
import { VerifyEmailInput } from './dto/verifyEmail.dto.input';
import { ResendVerificationEmailInput } from './dto/resendVerificationEmail.dto.input';
import bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { MailService } from '../mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}
  async register(registerAuthInput: RegisterAuthInput): Promise<AuthOutPut> {
    const { email, password, phoneNumber } = registerAuthInput;
    // Kiểm tra xem email đã tồn tại chưa
    const existingEmail = await this.authRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email đã tồn tại');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const auth: Omit<Auth, 'id' | 'createdAt' | 'updatedAt'> = {
      email,
      hashPassword,
      phoneNumber,
      role: 'user',
      isVerified: false,
    };
    const newAuth = await this.authRepository.save(auth);
    const tokens = await this.tokenService.generateToken({
      id: newAuth.id,
      email: newAuth.email,
      role: 'user',
    });

    // Đăng ký vẫn tự đăng nhập ngay — xác thực email chỉ mang tính xác nhận,
    // không chặn đăng nhập. Gửi email ở nền, không chặn luồng đăng ký nếu
    // SMTP chậm/lỗi.
    void this.sendVerificationEmail(newAuth).catch((error) =>
      console.error('Error sending verification email:', error),
    );

    return { auth: newAuth, tokens };
  }

  private async sendVerificationEmail(auth: Auth): Promise<void> {
    const verifyToken = await this.tokenService.generateEmailVerificationToken(
      auth.id,
    );
    const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verifyToken}`;
    await this.mailService.sendVerificationEmail(auth.email, verifyLink);
  }

  async login(loginAuthInput: LoginAuthInput): Promise<AuthOutPut> {
    const { email, password } = loginAuthInput;
    const auth = await this.authRepository.findByEmail(email);
    if (!auth) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    const isMatch = await bcrypt.compare(password, auth.hashPassword);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    // triển khai logic tạo token ở đây
    const tokens = await this.tokenService.generateToken({
      id: auth.id,
      email: auth.email,
      role: auth.role,
    });
    return { auth, tokens };
  }

  async refresh(refreshToken: string): Promise<AuthOutPut['tokens']> {
    return this.tokenService.renewByRefreshToken(refreshToken);
  }

  async getById(id: string): Promise<Auth> {
    const auth = await this.authRepository.findById(id);
    if (!auth) throw new Error('Auth không tồn tại');
    return auth;
  }

  async logout(payload: tokenPayload): Promise<void> {
    await this.tokenService.revokeRefreshToken(payload.tokenId!);
  }

  async remove(payload: tokenPayload): Promise<boolean> {
    const auth = await this.authRepository.findById(payload.id);
    if (!auth) {
      throw new Error('Auth không tồn tại');
    }
    await this.tokenService.revokeRefreshToken(payload.tokenId!);
    await this.authRepository.delete(payload.id);
    return true;
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<boolean> {
    const auth = await this.authRepository.findByEmail(input.email);
    // Luôn trả về true dù email có tồn tại hay không, để tránh lộ thông tin
    // email nào đã đăng ký tài khoản (user enumeration).
    if (!auth) return true;

    const resetToken = await this.tokenService.generateResetPasswordToken(
      auth.id,
    );
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await this.mailService.sendResetPasswordEmail(auth.email, resetLink);
    return true;
  }

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const authId = await this.tokenService.consumeResetPasswordToken(
      input.token,
    );
    if (!authId) {
      throw new Error('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    }
    const hashPassword = await bcrypt.hash(input.newPassword, 10);
    await this.authRepository.update(authId, { hashPassword });
    return true;
  }

  async verifyEmail(input: VerifyEmailInput): Promise<boolean> {
    const authId = await this.tokenService.consumeEmailVerificationToken(
      input.token,
    );
    if (!authId) {
      throw new Error('Token xác thực email không hợp lệ hoặc đã hết hạn');
    }
    await this.authRepository.update(authId, { isVerified: true });
    return true;
  }

  async resendVerificationEmail(
    input: ResendVerificationEmailInput,
  ): Promise<boolean> {
    const auth = await this.authRepository.findByEmail(input.email);
    // Luôn trả về true dù email có tồn tại hay đã xác thực hay chưa, để tránh
    // lộ thông tin email nào đã đăng ký (user enumeration).
    if (!auth || auth.isVerified) return true;

    await this.sendVerificationEmail(auth);
    return true;
  }
}
