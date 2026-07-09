import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useCancelOrder, useMyOrders } from '@/features/orders/hooks';
import { OrderStatusBadge } from '@/features/orders/status';
import { OrderStatusTimeline } from '@/features/orders/order-status-timeline';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/errors';
import type { Order } from '@/features/orders/api';

export function OrdersPage() {
  const { data: orders, isLoading, error } = useMyOrders();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (error) return <p className="text-sm text-destructive">Không tải được đơn hàng.</p>;

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <PackageOpen className="size-6" />
        </span>
        <p className="text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Đơn hàng của tôi</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [showHistory, setShowHistory] = useState(false);
  const cancelOrder = useCancelOrder();

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-background p-4">
      <div className="flex items-center justify-between">
        <div>
          <Link to={`/orders/${order.id}`} className="font-medium hover:underline">
            Đơn #{order.id.slice(0, 8)}
          </Link>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
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

      <div className="flex items-center justify-between">
        <p className="font-semibold">
          Tổng: <span className="text-primary">{formatPrice(order.totalPrice)}</span>
        </p>
        <div className="flex items-center gap-2">
          {order.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                cancelOrder.mutate(order.id, {
                  onSuccess: () => toast.success('Đã huỷ đơn hàng'),
                  onError: (error) => toast.error(getErrorMessage(error)),
                })
              }
            >
              Huỷ đơn
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => setShowHistory((prev) => !prev)}
          >
            {showHistory ? 'Ẩn lịch sử' : 'Xem lịch sử'}
            {showHistory ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {showHistory && (
        <>
          <Separator />
          <OrderStatusTimeline history={order.statusHistory} />
        </>
      )}
    </div>
  );
}
