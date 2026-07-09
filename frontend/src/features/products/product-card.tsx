import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format';
import { useCompare } from '@/features/compare/compare-context';
import { WishlistButton } from '@/features/wishlist/wishlist-button';
import { cn } from '@/lib/utils';
import type { Product } from './api';
import type { ProductTypeKey } from './product-types';

export function ProductCard({
  product,
  typeKey,
  action,
  showCompare,
  showWishlist,
}: {
  product: Product;
  typeKey: ProductTypeKey;
  action?: ReactNode;
  showCompare?: boolean;
  showWishlist?: boolean;
}) {
  return (
    <Card className="flex flex-col overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/products/${typeKey}/${product.id}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
          <Badge
            variant={product.stock > 0 ? 'secondary' : 'destructive'}
            className="absolute top-2 right-2 shadow-sm"
          >
            {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
          </Badge>
          {showWishlist && <WishlistButton typeKey={typeKey} productId={product.id} />}
        </div>
        <CardHeader className="pt-4">
          <CardTitle className="line-clamp-2 text-base">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
        </CardHeader>
      </Link>
      <CardContent className="pb-0">
        <span className="text-lg font-semibold text-primary">
          {formatPrice(product.price)}
        </span>
      </CardContent>
      {showCompare && (
        <CardContent className="pt-2 pb-0">
          <CompareCheckbox typeKey={typeKey} productId={product.id} />
        </CardContent>
      )}
      {action && <CardFooter className="pb-4">{action}</CardFooter>}
    </Card>
  );
}

function CompareCheckbox({
  typeKey,
  productId,
}: {
  typeKey: ProductTypeKey;
  productId: string;
}) {
  const { isSelected, toggle } = useCompare();
  const selected = isSelected(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(typeKey, productId);
      }}
      className={cn(
        'flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent',
      )}
    >
      <Scale className="size-3.5" />
      {selected ? 'Đang so sánh' : 'So sánh'}
    </button>
  );
}
