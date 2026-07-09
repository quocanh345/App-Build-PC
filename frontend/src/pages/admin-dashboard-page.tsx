import { LayoutDashboard, Package, ShoppingBag, TrendingUp, Users, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '@/features/dashboard/hooks';
import { OrderStatusBadge } from '@/features/orders/status';
import { PRODUCT_TYPE_ICONS } from '@/features/products/product-icons';
import { formatPrice } from '@/lib/format';
import type { OrderStatus } from '@/features/orders/api';
import { AdminNav } from '@/components/layout/admin-nav';

const STATUS_ORDER: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipping',
  'completed',
  'cancelled',
];

export function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !stats) {
    return <p className="text-sm text-destructive">Không tải được thống kê.</p>;
  }

  const maxStatusCount = Math.max(
    1,
    ...stats.ordersByStatus.map((row) => row.count),
  );
  const statusCountByStatus = new Map(
    stats.ordersByStatus.map((row) => [row.status, row.count]),
  );
  const maxTopQuantity = Math.max(1, ...stats.topProducts.map((p) => p.totalQuantity));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutDashboard className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">Tổng quan</h1>
      </div>

      <AdminNav />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={Wallet}
          label="Doanh thu (đơn hoàn thành)"
          value={formatPrice(stats.totalRevenue)}
        />
        <StatTile
          icon={ShoppingBag}
          label="Tổng đơn hàng"
          value={String(stats.totalOrders)}
        />
        <StatTile icon={Users} label="Người dùng" value={String(stats.totalUsers)} />
        <StatTile
          icon={Package}
          label="Sản phẩm trong kho"
          value={String(stats.totalProducts)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Đơn hàng theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {STATUS_ORDER.map((status) => {
              const count = statusCountByStatus.get(status) ?? 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-32 shrink-0">
                    <OrderStatusBadge status={status} />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4" />
              Sản phẩm bán chạy
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {stats.topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu bán hàng.</p>
            )}
            {stats.topProducts.map((product) => {
              const Icon = PRODUCT_TYPE_ICONS[product.productType];
              return (
                <div key={product.productName} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{product.productName}</p>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${(product.totalQuantity / maxTopQuantity) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {product.totalQuantity} bán
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className="truncate text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
