import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from '@/features/cart/hooks';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/errors';

export function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading, error } = useCart();
  const updateQuantity = useUpdateCartItemQuantity();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Không tải được giỏ hàng.</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingCart className="size-6" />
        </span>
        <p className="text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
        <Link to="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Giỏ hàng ({cart.items.length})</h1>
        <Button variant="ghost" size="sm" onClick={() => clearCart.mutate()}>
          Xóa tất cả
        </Button>
      </div>

      <div className="flex flex-col divide-y rounded-xl border bg-background">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="size-16 shrink-0 rounded-lg border object-cover"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{item.productName}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.unitPrice)} / sản phẩm
              </p>
            </div>
            <Input
              type="number"
              min={1}
              max={item.stock}
              defaultValue={item.quantity}
              className="w-20"
              onBlur={(e) => {
                const quantity = Math.max(1, Number(e.target.value));
                if (quantity !== item.quantity) {
                  updateQuantity.mutate(
                    { itemId: item.id, quantity },
                    { onError: (error) => toast.error(getErrorMessage(error)) },
                  );
                }
              }}
            />
            <p className="w-28 shrink-0 text-right font-semibold text-primary">
              {formatPrice(item.subtotal)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeItem.mutate(item.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border bg-background p-4">
        <span className="text-lg font-semibold">
          Tổng: <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
        </span>
        <Button size="lg" onClick={() => navigate('/checkout')}>
          Đến thanh toán
        </Button>
      </div>
    </div>
  );
}
