import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart, useCheckoutCart } from '@/features/cart/hooks';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/errors';

const checkoutSchema = z.object({
  shippingAddress: z.string().min(5, 'Địa chỉ quá ngắn'),
  phoneNumber: z.string().min(9, 'Số điện thoại không hợp lệ'),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const checkout = useCheckoutCart();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const isCartEmpty = !cart || cart.items.length === 0;

  useEffect(() => {
    if (isCartEmpty) navigate('/cart');
  }, [isCartEmpty, navigate]);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  function onSubmit(values: CheckoutFormValues) {
    checkout.mutate(values, {
      onSuccess: () => {
        toast.success('Đặt hàng thành công');
        navigate('/orders');
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <PackageCheck className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">Thanh toán</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Đơn hàng ({cart.items.length} sản phẩm)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="truncate">
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-3" />
          <p className="flex justify-between text-base font-semibold">
            <span>Tổng tiền</span>
            <span className="text-primary">{formatPrice(cart.totalPrice)}</span>
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="shippingAddress">Địa chỉ giao hàng</Label>
          <Input id="shippingAddress" {...register('shippingAddress')} />
          {errors.shippingAddress && (
            <p className="text-sm text-destructive">
              {errors.shippingAddress.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input id="phoneNumber" {...register('phoneNumber')} />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note">Ghi chú (tuỳ chọn)</Label>
          <Input id="note" {...register('note')} />
        </div>

        <Button type="submit" size="lg" disabled={checkout.isPending}>
          Xác nhận đặt hàng
        </Button>
      </form>
    </div>
  );
}
