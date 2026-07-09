import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/lib/errors';
import { useAddToCart } from './hooks';
import type { ProductTypeKey } from '../products/product-types';

export function AddToCartButton({
  typeKey,
  productId,
  stock,
}: {
  typeKey: ProductTypeKey;
  productId: string;
  stock: number;
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  function handleAdd() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart.mutate(
      { productType: typeKey, productId, quantity },
      {
        onSuccess: () => toast.success('Đã thêm vào giỏ hàng'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  return (
    <div className="flex w-full items-center gap-2" onClick={(e) => e.preventDefault()}>
      <Input
        type="number"
        min={1}
        max={stock}
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        className="w-16"
      />
      <Button
        size="sm"
        className="flex-1"
        disabled={stock <= 0 || addToCart.isPending}
        onClick={handleAdd}
      >
        {stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
      </Button>
    </div>
  );
}
