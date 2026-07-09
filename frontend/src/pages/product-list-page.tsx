import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProductList } from '@/features/products/hooks';
import { ProductGrid } from '@/features/products/product-grid';
import { ProductFilterPanel } from '@/features/products/product-filter-panel';
import { useAdvancedProductFilters } from '@/features/products/use-advanced-filters';
import { getFilterFields } from '@/features/products/filter-fields';
import { AddToCartButton } from '@/features/cart/add-to-cart-button';
import { PRODUCT_TYPE_ICONS } from '@/features/products/product-icons';
import { Input } from '@/components/ui/input';
import {
  findProductTypeConfig,
  type ProductTypeKey,
} from '@/features/products/product-types';

export function ProductListPage() {
  const { type } = useParams<{ type: string }>();
  const config = findProductTypeConfig(type ?? '');

  if (!config) {
    return <p className="text-sm text-destructive">Loại sản phẩm không tồn tại.</p>;
  }

  return <ProductListContent typeKey={config.key} label={config.label} />;
}

function ProductListContent({
  typeKey,
  label,
}: {
  typeKey: ProductTypeKey;
  label: string;
}) {
  const { data, isLoading, error } = useProductList(typeKey);
  const filterFields = getFilterFields(typeKey);
  const {
    search,
    setSearch,
    fieldMeta,
    discreteSelections,
    rangeSelections,
    toggleDiscrete,
    setRange,
    resetFilters,
    activeFilterCount,
    filtered,
  } = useAdvancedProductFilters(data, filterFields);
  const Icon = PRODUCT_TYPE_ICONS[typeKey];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold">{label}</h1>
          <p className="text-sm text-muted-foreground">
            {filtered
              ? `${filtered.length}/${data?.length ?? 0} sản phẩm`
              : 'Đang tải...'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên sản phẩm..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ProductFilterPanel
          fields={filterFields}
          fieldMeta={fieldMeta}
          discreteSelections={discreteSelections}
          rangeSelections={rangeSelections}
          onToggleDiscrete={toggleDiscrete}
          onSetRange={setRange}
          onReset={resetFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>

      <ProductGrid
        products={filtered}
        isLoading={isLoading}
        error={error}
        typeKey={typeKey}
        showCompare
        showWishlist
        renderAction={(product) => (
          <AddToCartButton
            typeKey={typeKey}
            productId={product.id}
            stock={product.stock}
          />
        )}
      />
    </div>
  );
}
