import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/utils';
import { useToggleWishlist, useWishlist } from './hooks';
import type { ProductTypeKey } from '../products/product-types';

export function WishlistButton({
  typeKey,
  productId,
  variant = 'overlay',
}: {
  typeKey: ProductTypeKey;
  productId: string;
  variant?: 'overlay' | 'inline';
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: wishlist } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const isSaved = !!wishlist?.some((item) => item.productId === productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist.mutate(
      { typeKey, productId },
      {
        onSuccess: (added) =>
          toast.success(added ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors',
          isSaved
            ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40'
            : 'text-muted-foreground hover:bg-accent',
        )}
      >
        <Heart className={cn('size-4', isSaved && 'fill-red-500 text-red-500')} />
        {isSaved ? 'Đã yêu thích' : 'Yêu thích'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute top-2 left-2 flex size-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-red-500"
    >
      <Heart className={cn('size-4', isSaved && 'fill-red-500 text-red-500')} />
    </button>
  );
}
