import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { recordRecentlyViewed } from '@/features/recently-viewed/store';
import { useProductDetail } from '@/features/products/hooks';
import type { Product } from '@/features/products/api';
import {
  COMMON_PRODUCT_FIELDS,
  findProductTypeConfig,
  type ProductTypeConfig,
} from '@/features/products/product-types';
import { AddToCartButton } from '@/features/cart/add-to-cart-button';
import { WishlistButton } from '@/features/wishlist/wishlist-button';
import { ReviewSection } from '@/features/reviews/review-section';
import { StarRating } from '@/features/reviews/star-rating';
import { useRatingSummary } from '@/features/reviews/hooks';
import { formatPrice } from '@/lib/format';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const META_FIELDS = new Set<string>([...COMMON_PRODUCT_FIELDS, '__typename']);

export function ProductDetailPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const config = findProductTypeConfig(type ?? '');

  if (!config) {
    return <p className="text-sm text-destructive">Loại sản phẩm không tồn tại.</p>;
  }

  return <ProductDetailContent config={config} id={id} />;
}

function ProductDetailContent({
  config,
  id,
}: {
  config: ProductTypeConfig;
  id?: string;
}) {
  const { data: product, isLoading, error } = useProductDetail(config.key, id);

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <p className="text-sm text-destructive">Không tìm thấy sản phẩm.</p>;
  }

  const labelByField = new Map(config.formFields.map((f) => [f.name, f.label]));
  const specs = Object.entries(product).filter(([key]) => !META_FIELDS.has(key));

  return <ProductDetailBody config={config} product={product} labelByField={labelByField} specs={specs} />;
}

function ProductDetailBody({
  config,
  product,
  labelByField,
  specs,
}: {
  config: ProductTypeConfig;
  product: Product;
  labelByField: Map<string, string>;
  specs: [string, unknown][];
}) {
  const { data: summary } = useRatingSummary(config.key, product.id);

  useEffect(() => {
    recordRecentlyViewed(config.key, product.id);
  }, [config.key, product.id]);

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/products/${config.key}`}
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Quay lại {config.label}
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-muted-foreground">{product.manufacturer}</p>
            {summary && summary.count > 0 && (
              <div className="mt-1 flex items-center gap-1.5">
                <StarRating value={Math.round(summary.average)} />
                <span className="text-sm text-muted-foreground">
                  {summary.average}/5 ({summary.count} đánh giá)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'}>
              {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <AddToCartButton
                typeKey={config.key}
                productId={product.id}
                stock={product.stock}
              />
            </div>
            <WishlistButton
              typeKey={config.key}
              productId={product.id}
              variant="inline"
            />
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-medium">Thông số kỹ thuật</h2>
            <dl className="divide-y rounded-lg border text-sm">
              {specs.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 px-3 py-2">
                  <dt className="text-muted-foreground">
                    {labelByField.get(key) ?? key}
                  </dt>
                  <dd className="font-medium">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="mb-2 font-medium">Mô tả</h2>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        </div>
      </div>

      <Separator />
      <ReviewSection typeKey={config.key} productId={product.id} />
    </div>
  );
}
