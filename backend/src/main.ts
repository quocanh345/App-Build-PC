// Phải nạp trước mọi import khác — app.module.ts đọc process.env ngay khi
// @Module() được decorator hoá lúc import, nên .env cần có sẵn từ dòng đầu tiên.
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cần để đọc request.cookies (refreshToken) trong AuthGuard/AuthResolver.
  app.use(cookieParser());

  // Frontend chạy ở origin khác (cổng khác, hoặc app desktop Tauri) nên cần bật
  // CORS + credentials để trình duyệt/WebView gửi/nhận cookie refreshToken httpOnly.
  // Nếu set CORS_ORIGIN (vd khi deploy thật) thì dùng đúng danh sách đó.
  // Ngược lại (dev), cho phép mọi cổng localhost/127.0.0.1 — vì Vite hay tự đổi
  // cổng khi cổng mặc định (5173) đã bị chiếm (vd đang chạy song song `tauri dev`
  // và `npm run dev` riêng để test web), cộng thêm origin của bản build Tauri
  // thật ("https://tauri.localhost", phục vụ qua custom protocol).
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [/^https?:\/\/(localhost|127\.0\.0\.1):\d+$/, 'https://tauri.localhost'];
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
