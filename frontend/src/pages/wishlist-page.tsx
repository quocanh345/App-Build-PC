import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AddToCartButton } from '@/features/cart/add-to-cart-button';
import { useToggleWishlist, useWishlist } from '@/features/wishlist/hooks';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/errors';

export function WishlistPage() {
  const { data: items, isLoading, error } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  if (error) return <p className="text-sm text-destructive">Không tải được danh sách yêu thích.</p>;

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Heart className="size-6" />
        </span>
        <p className="text-muted-foreground">Bạn chưa lưu sản phẩm yêu thích nào.</p>
        <Link to="/">
          <Button>Khám phá sản phẩm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Sản phẩm yêu thích ({items.length})</h1>

      <div className="flex flex-col divide-y rounded-xl border bg-background">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <Link to={`/products/${item.productType}/${item.productId}`} className="shrink-0">
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="size-16 rounded-lg border object-cover"
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden';
                }}
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to={`/products/${item.productType}/${item.productId}`}
                className="truncate font-medium hover:underline"
              >
                {item.productName}
              </Link>
              <p className="text-sm text-primary">{formatPrice(item.price)}</p>
            </div>
            <div className="w-44 shrink-0">
              <AddToCartButton
                typeKey={item.productType}
                productId={item.productId}
                stock={item.stock}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() =>
                toggleWishlist.mutate(
                  { typeKey: item.productType, productId: item.productId },
                  {
                    onSuccess: () => toast.success('Đã bỏ khỏi yêu thích'),
                    onError: (error) => toast.error(getErrorMessage(error)),
                  },
                )
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
