import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;

  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    // Chưa cấu hình SMTP (vd môi trường dev) → transporter = null, sendMail sẽ
    // chỉ log ra console thay vì gửi thật, để không chặn luồng phát triển.
    this.transporter =
      SMTP_HOST && SMTP_USER && SMTP_PASS
        ? nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT ? Number(SMTP_PORT) : 587,
            secure: Number(SMTP_PORT) === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
          })
        : null;
  }

  async sendResetPasswordEmail(
    email: string,
    resetLink: string,
  ): Promise<void> {
    const subject = 'Đặt lại mật khẩu';
    const html = `
      <p>Bạn (hoặc ai đó) vừa yêu cầu đặt lại mật khẩu cho tài khoản này.</p>
      <p>Nhấn vào liên kết bên dưới để đặt lại mật khẩu. Liên kết có hiệu lực trong 15 phút:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `;

    if (!this.transporter) {
      this.logger.warn(
        `SMTP chưa được cấu hình — không gửi email thật. Reset link cho ${email}: ${resetLink}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      html,
    });
  }

  async sendVerificationEmail(
    email: string,
    verifyLink: string,
  ): Promise<void> {
    const subject = 'Xác thực địa chỉ email';
    const html = `
      <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
      <p>Nhấn vào liên kết bên dưới để xác thực email. Liên kết có hiệu lực trong 24 giờ:</p>
      <p><a href="${verifyLink}">${verifyLink}</a></p>
      <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
    `;

    if (!this.transporter) {
      this.logger.warn(
        `SMTP chưa được cấu hình — không gửi email thật. Verify link cho ${email}: ${verifyLink}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      html,
    });
  }
}
