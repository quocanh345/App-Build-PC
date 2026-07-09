import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Scale, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompare } from '@/features/compare/compare-context';
import { fetchProductById } from '@/features/products/api';
import {
  getProductTypeConfig,
  type ProductTypeKey,
} from '@/features/products/product-types';
import { formatPrice } from '@/lib/format';

export function ComparePage() {
  const { typeKey, ids, toggle } = useCompare();

  if (!typeKey || ids.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Scale className="size-6" />
        </span>
        <p className="text-muted-foreground">Chưa có sản phẩm nào để so sánh.</p>
        <Link to="/">
          <Button>Duyệt sản phẩm</Button>
        </Link>
      </div>
    );
  }

  return <CompareContent typeKey={typeKey} ids={ids} onRemove={(id) => toggle(typeKey, id)} />;
}

function CompareContent({
  typeKey,
  ids,
  onRemove,
}: {
  typeKey: ProductTypeKey;
  ids: string[];
  onRemove: (id: string) => void;
}) {
  const config = getProductTypeConfig(typeKey);
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['product', typeKey, id],
      queryFn: () => fetchProductById(typeKey, id),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const products = results.map((r) => r.data).filter((p): p is NonNullable<typeof p> => !!p);

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  const rows = [
    { label: 'Giá', get: (p: (typeof products)[number]) => formatPrice(p.price) },
    { label: 'Hãng sản xuất', get: (p: (typeof products)[number]) => p.manufacturer },
    { label: 'Tồn kho', get: (p: (typeof products)[number]) => String(p.stock) },
    ...config.formFields.map((field) => ({
      label: field.label,
      get: (p: (typeof products)[number]) => String(p[field.name] ?? '—'),
    })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Scale className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">So sánh {config.label}</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-0 rounded-xl border bg-background">
          <thead>
            <tr>
              <th className="w-40 p-3 text-left text-sm text-muted-foreground">
                Sản phẩm
              </th>
              {products.map((product) => (
                <th key={product.id} className="min-w-[200px] border-l p-3 text-left">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/products/${typeKey}/${product.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="aspect-[4/3] w-full rounded-md object-cover"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t">
                <td className="p-3 text-sm font-medium text-muted-foreground">
                  {row.label}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="border-l p-3 text-sm">
                    {row.get(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
