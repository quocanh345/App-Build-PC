import { tokenPayload } from './auth.type';

declare global {
  namespace Express {
    interface Request {
      payload?: tokenPayload; // Thêm thuộc tính user vào Request
    }
  }
}
