import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { Auth } from './entities/auth.entity';
import { AuthRepository } from './auth.repositories';
import { TokenService } from './token.service';
import { AuthGuard, LogOutAuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { MailModule } from '../mail/mail.module';

@Module({
  // forFeature([Auth]) đăng ký Repository<Auth> để có thể inject vào AuthService
  imports: [
    TypeOrmModule.forFeature([Auth]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'default_secret_key',
      }),
    }),
    MailModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    AuthRepository,
    TokenService,
    AuthGuard,
    LogOutAuthGuard,
    RolesGuard,
  ],
  exports: [
    AuthRepository,
    TokenService,
    AuthGuard,
    LogOutAuthGuard,
    RolesGuard,
    MailModule,
  ],
})
export class AuthModule {}
