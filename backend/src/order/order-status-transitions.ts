import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from './order-status.enum';

// pending → confirmed → shipping → completed, huỷ chỉ được phép khi còn pending/confirmed.
// Đã shipping/completed thì không cho quay lại hay huỷ nữa (đổi trả là nghiệp vụ khác).
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPING, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPING]: [OrderStatus.COMPLETED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Chờ xử lý',
  [OrderStatus.CONFIRMED]: 'Đã xác nhận',
  [OrderStatus.SHIPPING]: 'Đang vận chuyển',
  [OrderStatus.COMPLETED]: 'Đã giao',
  [OrderStatus.CANCELLED]: 'Đã huỷ',
};

export function assertStatusTransitionAllowed(
  current: OrderStatus,
  next: OrderStatus,
): void {
  if (current === next) return;
  if (!ALLOWED_TRANSITIONS[current].includes(next)) {
    throw new BadRequestException(
      `Không thể chuyển đơn hàng từ "${STATUS_LABEL[current]}" sang "${STATUS_LABEL[next]}"`,
    );
  }
}
