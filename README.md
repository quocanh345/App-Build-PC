# AppPC — nền tảng bán & tư vấn build PC

Ứng dụng thương mại điện tử chuyên về linh kiện máy tính: duyệt sản phẩm theo từng
loại linh kiện, dựng cấu hình, so sánh, đặt hàng và quản trị vận hành. Chạy trên web
lẫn desktop (đóng gói bằng Tauri).

## Kiến trúc

Monorepo gồm 2 phần độc lập, giao tiếp qua một API GraphQL duy nhất:

```
AppPC/
├── backend/    NestJS + GraphQL (code-first) + PostgreSQL (TypeORM) + Redis
└── frontend/   React + Vite, đóng gói thêm bằng Tauri để chạy dưới dạng app desktop
```

## Tính năng chính

- **Danh mục sản phẩm** theo 8 loại linh kiện riêng biệt: CPU, RAM, VGA, Mainboard, PSU,
  Cooler, Case, SSD — mỗi loại có thông số kỹ thuật đặc thù.
- **Dựng cấu hình (Build)** và **so sánh sản phẩm (Compare)**.
- **Giỏ hàng → đặt hàng**: kiểm tra & trừ tồn kho theo transaction, lưu lại giá tại thời
  điểm mua, theo dõi trạng thái đơn hàng (Pending → Confirmed → Shipping → Completed).
- **Tài khoản**: đăng ký/đăng nhập bằng JWT + refresh token (lưu phiên qua Redis), quên/đặt
  lại mật khẩu, xác thực email qua Nodemailer/SMTP.
- **Wishlist, đánh giá sản phẩm, sản phẩm đã xem gần đây, khiếu nại đơn hàng.**
- **Trang quản trị (admin)**: dashboard thống kê doanh thu/đơn hàng, quản lý sản phẩm,
  quản lý đơn hàng, xử lý khiếu nại.
- **Ứng dụng desktop (Tauri)**: nhận thông báo hệ điều hành khi trạng thái đơn hàng thay đổi.

## Công nghệ sử dụng

| Lớp | Công nghệ |
| --- | --- |
| Backend | NestJS 11, GraphQL (Apollo, code-first), TypeORM, PostgreSQL, Redis (ioredis), bcrypt, Nodemailer |
| Frontend | React 19, Vite, React Router 7, TanStack Query, react-hook-form + zod, shadcn/ui + Tailwind CSS, graphql-request |
| Desktop | Tauri 2 |

## Chạy dự án ở local

### Yêu cầu

- Node.js 20+
- PostgreSQL đang chạy (mặc định kết nối `localhost:5432`, database `buildpc`)
- Redis đang chạy (mặc định `redis://localhost:6379`)

### Backend

```bash
cd backend
npm install
```

Tạo file `backend/.env`:

```env
DATABASE_PASSWORD='mật khẩu Postgres của bạn'

# Tùy chọn — nếu bỏ trống, email sẽ chỉ được log ra console thay vì gửi thật
SMTP_HOST='smtp.gmail.com'
SMTP_PORT=587
SMTP_USER='tài khoản gmail dùng để gửi'
SMTP_PASS='App Password của Gmail (không phải mật khẩu Gmail thường)'
```

Chạy backend (mặc định cổng `3000`, GraphQL Playground tại `/graphql`):

```bash
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Mặc định frontend gọi API tại `http://localhost:3000/graphql`. Có thể đổi bằng biến môi
trường `VITE_API_URL` trong `frontend/.env`.

### Chạy bản desktop (Tauri)

```bash
cd frontend
npm run tauri dev
```
