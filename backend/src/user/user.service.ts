import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { AuthRepository } from '../auth/auth.repositories';
import { TokenService } from '../auth/token.service';
import { MailService } from '../mail/mail.service';
import { User } from './entities/user.entity';
import { Auth } from '../auth/entities/auth.entity';
import {
  UpdateProfileInput,
  ChangePasswordInput,
  ChangePhoneNumberInput,
  ChangeAddressInput,
  ChangeUsernameInput,
  ChangeEmailInput,
} from './dto/changeInfo.dto.input';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async getProfile(id: string): Promise<User> {
    return this.userRepository.getOrCreate(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateProfile(id: string, input: UpdateProfileInput): Promise<User> {
    return this.userRepository.update(id, input);
  }

  async changeUsername(id: string, input: ChangeUsernameInput): Promise<User> {
    return this.userRepository.update(id, { username: input.newUsername });
  }

  async changeAddress(id: string, input: ChangeAddressInput): Promise<User> {
    return this.userRepository.update(id, { address: input.newAddress });
  }

  async changePhoneNumber(
    id: string,
    input: ChangePhoneNumberInput,
  ): Promise<Auth> {
    const existing = await this.authRepository.findByPhoneNumber(
      input.newPhoneNumber,
    );
    if (existing && existing.id !== id) {
      throw new BadRequestException('Số điện thoại đã được sử dụng');
    }
    return this.authRepository.update(id, {
      phoneNumber: input.newPhoneNumber,
    });
  }

  async changeEmail(id: string, input: ChangeEmailInput): Promise<Auth> {
    const existing = await this.authRepository.findByEmail(input.newEmail);
    if (existing && existing.id !== id) {
      throw new BadRequestException('Email đã được sử dụng');
    }
    // Đổi email → địa chỉ mới chưa được xác thực, phải gửi lại email xác thực.
    const auth = await this.authRepository.update(id, {
      email: input.newEmail,
      isVerified: false,
    });
    const verifyToken = await this.tokenService.generateEmailVerificationToken(
      auth.id,
    );
    const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verifyToken}`;
    void this.mailService
      .sendVerificationEmail(auth.email, verifyLink)
      .catch((error) =>
        console.error('Error sending verification email:', error),
      );
    return auth;
  }

  async changePassword(
    id: string,
    input: ChangePasswordInput,
  ): Promise<boolean> {
    const auth = await this.authRepository.findById(id);
    if (!auth) throw new BadRequestException('Auth không tồn tại');

    const isMatch = await bcrypt.compare(input.oldPassword, auth.hashPassword);
    if (!isMatch) throw new BadRequestException('Mật khẩu cũ không đúng');

    const hashPassword = await bcrypt.hash(input.newPassword, 10);
    await this.authRepository.update(id, { hashPassword });
    return true;
  }

  async removeProfile(id: string): Promise<boolean> {
    await this.userRepository.remove(id);
    return true;
  }
}
