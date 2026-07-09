import { Link } from 'react-router-dom';
import { ArrowRight, Wrench } from 'lucide-react';
import { PRODUCT_TYPES } from '@/features/products/product-types';
import { PRODUCT_TYPE_ICONS } from '@/features/products/product-icons';
import { Button } from '@/components/ui/button';
import { RecentlyViewedSection } from '@/features/recently-viewed/recently-viewed-section';

export function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-10 text-center sm:p-16">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Linh kiện chính hãng · Giao nhanh
          </span>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Xây dựng cấu hình PC{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              của riêng bạn
            </span>
          </h1>
          <p className="text-balance text-muted-foreground sm:text-lg">
            Mua lẻ từng linh kiện, hoặc dùng công cụ Build PC để chọn combo hoàn chỉnh
            với tổng giá tính sẵn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/build">
              <Button size="lg" className="gap-2">
                <Wrench className="size-4" />
                Build PC ngay
              </Button>
            </Link>
            <Link to="/products/cpu">
              <Button size="lg" variant="outline" className="gap-2">
                Xem sản phẩm
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Danh mục sản phẩm</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PRODUCT_TYPES.map((type) => {
            const Icon = PRODUCT_TYPE_ICONS[type.key];
            return (
              <Link key={type.key} to={`/products/${type.key}`} className="group">
                <div className="flex flex-col items-center gap-3 rounded-xl border bg-background p-6 text-center transition-all group-hover:border-primary group-hover:shadow-md">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" />
                  </span>
                  <span className="font-medium">{type.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <RecentlyViewedSection />
    </div>
  );
}
