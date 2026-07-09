import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useAllOrders, useUpdateOrderStatus } from '@/features/orders/hooks';
import { STATUS_LABEL } from '@/features/orders/status';
import { OrderStatusTimeline } from '@/features/orders/order-status-timeline';
import type { Order, OrderStatus } from '@/features/orders/api';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/errors';
import { AdminNav } from '@/components/layout/admin-nav';

// Khớp với state machine phía backend (order-status-transitions.ts) — chỉ để giới
// hạn lựa chọn hiển thị cho admin, backend vẫn là nơi chặn thật sự.
const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipping', 'cancelled'],
  shipping: ['completed'],
  completed: [],
  cancelled: [],
};

const FILTER_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: STATUS_LABEL.pending },
  { value: 'confirmed', label: STATUS_LABEL.confirmed },
  { value: 'shipping', label: STATUS_LABEL.shipping },
  { value: 'completed', label: STATUS_LABEL.completed },
  { value: 'cancelled', label: STATUS_LABEL.cancelled },
];

export function AdminOrdersPage() {
  const { data: orders, isLoading, error } = useAllOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = useMemo(() => {
    if (!orders) return orders;
    if (statusFilter === 'all') return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ClipboardList className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">Quản lý đơn hàng</h1>
      </div>

      <AdminNav />

      {orders && orders.length > 0 && (
        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
          >
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {filteredOrders?.length ?? 0}/{orders.length} đơn hàng
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      )}
      {error && <p className="text-sm text-destructive">Không tải được đơn hàng.</p>}
      {orders && orders.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có đơn hàng nào.</p>
      )}
      {filteredOrders && filteredOrders.length === 0 && orders && orders.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Không có đơn hàng nào ở trạng thái này.
        </p>
      )}

      {filteredOrders?.map((order) => (
        <AdminOrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function AdminOrderCard({ order }: { order: Order }) {
  const [showHistory, setShowHistory] = useState(false);
  const updateStatus = useUpdateOrderStatus();
  const selectableStatuses = [order.status, ...NEXT_STATUSES[order.status]];

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-background p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Đơn #{order.id.slice(0, 8)}</p>
          <p className="text-sm text-muted-foreground">
            Khách hàng: {order.userId.slice(0, 8)} ·{' '}
            {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
        <Select
          value={order.status}
          onValueChange={(value) => {
            // Chọn lại đúng trạng thái hiện tại thì bỏ qua, không gọi API.
            if (value === order.status) return;
            updateStatus.mutate(
              { id: order.id, status: value as OrderStatus },
              {
                onSuccess: () => toast.success('Đã cập nhật trạng thái'),
                onError: (error) => toast.error(getErrorMessage(error)),
              },
            );
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {selectableStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-2">
            <span className="truncate">
              {item.productName} × {item.quantity}
            </span>
            <span>{formatPrice(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="font-semibold">
          Tổng: <span className="text-primary">{formatPrice(order.totalPrice)}</span>
        </p>
        <p className="text-muted-foreground">
          Giao tới: {order.shippingAddress} · SĐT: {order.phoneNumber}
        </p>
      </div>

      {order.status === 'shipping' && (
        <Button
          className="w-fit gap-2 bg-green-600 hover:bg-green-700"
          disabled={updateStatus.isPending}
          onClick={() =>
            updateStatus.mutate(
              { id: order.id, status: 'completed' },
              {
                onSuccess: () => toast.success('Đã xác nhận giao hàng thành công'),
                onError: (error) => toast.error(getErrorMessage(error)),
              },
            )
          }
        >
          <CheckCircle2 className="size-4" />
          Xác nhận đã giao hàng
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="w-fit gap-1"
        onClick={() => setShowHistory((prev) => !prev)}
      >
        {showHistory ? 'Ẩn lịch sử' : 'Xem lịch sử'}
        {showHistory ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </Button>

      {showHistory && (
        <>
          <Separator />
          <OrderStatusTimeline history={order.statusHistory} />
        </>
      )}
    </div>
  );
}
