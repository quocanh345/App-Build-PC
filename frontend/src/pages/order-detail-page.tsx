import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCancelOrder, useOrderDetail } from '@/features/orders/hooks';
import { OrderStatusBadge } from '@/features/orders/status';
import { OrderStatusTimeline } from '@/features/orders/order-status-timeline';
import { ComplaintSection } from '@/features/complaints/complaint-section';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/errors';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useOrderDetail(id);
  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return <p className="text-sm text-destructive">Không tìm thấy đơn hàng.</p>;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Quay lại đơn hàng
        </Link>
        <OrderStatusBadge status={order.status} />
      </div>

      <div>
        <h1 className="text-xl font-semibold">Đơn #{order.id.slice(0, 8)}</h1>
        <p className="text-sm text-muted-foreground">
          Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col divide-y">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-2">
                <div>
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.unitPrice)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.subtotal)}</p>
              </li>
            ))}
          </ul>
          <Separator className="my-3" />
          <p className="flex justify-between text-base font-semibold">
            <span>Tổng tiền</span>
            <span className="text-primary">{formatPrice(order.totalPrice)}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin giao hàng</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            {order.shippingAddress}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="size-4 shrink-0" />
            {order.phoneNumber}
          </p>
          {order.note && <p className="italic">Ghi chú: {order.note}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lịch sử trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusTimeline history={order.statusHistory} />
        </CardContent>
      </Card>

      {order.status === 'pending' && (
        <Button
          variant="outline"
          className="w-fit"
          onClick={() =>
            cancelOrder.mutate(order.id, {
              onSuccess: () => toast.success('Đã huỷ đơn hàng'),
              onError: (error) => toast.error(getErrorMessage(error)),
            })
          }
        >
          Huỷ đơn hàng
        </Button>
      )}

      <Separator />
      <ComplaintSection orderId={order.id} orderStatus={order.status} />
    </div>
  );
}
