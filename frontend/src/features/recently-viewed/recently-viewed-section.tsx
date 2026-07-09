import { useQueries } from '@tanstack/react-query';
import { History } from 'lucide-react';
import { ProductCard } from '@/features/products/product-card';
import { fetchProductById } from '@/features/products/api';
import { getRecentlyViewed } from './store';

export function RecentlyViewedSection() {
  const entries = getRecentlyViewed();

  const results = useQueries({
    queries: entries.map((entry) => ({
      queryKey: ['product', entry.typeKey, entry.productId],
      queryFn: () => fetchProductById(entry.typeKey, entry.productId),
    })),
  });

  const items = entries
    .map((entry, i) => ({ entry, product: results[i]?.data }))
    .filter((row): row is { entry: typeof row.entry; product: NonNullable<typeof row.product> } =>
      !!row.product,
    );

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <History className="size-5" />
        Đã xem gần đây
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        {items.map(({ entry, product }) => (
          <ProductCard
            key={`${entry.typeKey}-${entry.productId}`}
            product={product}
            typeKey={entry.typeKey}
          />
        ))}
      </div>
    </section>
  );
}
