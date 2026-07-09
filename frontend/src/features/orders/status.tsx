import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from './api';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Đã giao hàng',
  cancelled: 'Đã huỷ',
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  shipping: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={STATUS_CLASS[status]}>{STATUS_LABEL[status]}</Badge>
  );
}
