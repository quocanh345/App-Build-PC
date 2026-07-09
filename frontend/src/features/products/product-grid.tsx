import type { ReactNode } from 'react';
import { PackageSearch, TriangleAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from './product-card';
import type { Product } from './api';
import type { ProductTypeKey } from './product-types';

export function ProductGrid({
  products,
  isLoading,
  error,
  typeKey,
  renderAction,
  showCompare,
  showWishlist,
}: {
  products: Product[] | undefined;
  isLoading: boolean;
  error: unknown;
  typeKey: ProductTypeKey;
  renderAction?: (product: Product) => ReactNode;
  showCompare?: boolean;
  showWishlist?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-xl border p-3">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
        <TriangleAlert className="size-8 text-destructive" />
        <p className="text-sm text-destructive">
          Không tải được danh sách sản phẩm. Vui lòng thử lại.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-16 text-center">
        <PackageSearch className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Chưa có sản phẩm nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          typeKey={typeKey}
          action={renderAction?.(product)}
          showCompare={showCompare}
          showWishlist={showWishlist}
        />
      ))}
    </div>
  );
}
