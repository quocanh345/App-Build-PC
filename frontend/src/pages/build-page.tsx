import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Search,
  ShoppingCart,
  TriangleAlert,
  XCircle,
  Wrench,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/auth-context';
import { useAddToCart } from '@/features/cart/hooks';
import { useProductList } from '@/features/products/hooks';
import { ProductGrid } from '@/features/products/product-grid';
import { ProductFilterPanel } from '@/features/products/product-filter-panel';
import { useAdvancedProductFilters } from '@/features/products/use-advanced-filters';
import { getFilterFields } from '@/features/products/filter-fields';
import { PRODUCT_TYPE_ICONS } from '@/features/products/product-icons';
import {
  PRODUCT_TYPES,
  type ProductTypeKey,
} from '@/features/products/product-types';
import type { Product } from '@/features/products/api';
import { checkCompatibility } from '@/features/build/compatibility';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/utils';

interface Selection {
  product: Product;
  quantity: number;
}

export function BuildPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const [selections, setSelections] = useState<
    Partial<Record<ProductTypeKey, Selection>>
  >({});
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEntries = Object.entries(selections) as [
    ProductTypeKey,
    Selection,
  ][];
  const totalPrice = selectedEntries.reduce(
    (sum, [, selection]) => sum + selection.product.price * selection.quantity,
    0,
  );
  const compatibilityIssues = useMemo(
    () => checkCompatibility(selections),
    [selections],
  );

  function selectProduct(type: ProductTypeKey, product: Product, quantity: number) {
    setSelections((prev) => ({ ...prev, [type]: { product, quantity } }));
    // Đã chọn xong thì tự thu gọn khu vực này lại.
    setOpenItems((prev) => prev.filter((key) => key !== type));
  }

  function removeSelection(type: ProductTypeKey) {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  }

  async function handleAddAllToCart() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (selectedEntries.length === 0) {
      toast.error('Bạn chưa chọn linh kiện nào');
      return;
    }

    setIsSubmitting(true);
    try {
      for (const [type, selection] of selectedEntries) {
        await addToCart.mutateAsync({
          productType: type,
          productId: selection.product.id,
          quantity: selection.quantity,
        });
      }
      toast.success('Đã thêm toàn bộ combo vào giỏ hàng');
      navigate('/cart');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Wrench className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold">Build PC</h1>
          <p className="text-sm text-muted-foreground">
            Chọn linh kiện cho từng khu vực — không bắt buộc chọn đủ cả 8 loại.
          </p>
        </div>
      </div>

      {compatibilityIssues.length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
          <p className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200">
            <TriangleAlert className="size-4" />
            Có {compatibilityIssues.length} vấn đề tương thích cần lưu ý
          </p>
          <ul className="flex flex-col gap-1.5">
            {compatibilityIssues.map((issue, i) => (
              <li
                key={i}
                className={cn(
                  'flex items-start gap-2 text-sm',
                  issue.severity === 'error'
                    ? 'text-destructive'
                    : 'text-amber-800 dark:text-amber-300',
                )}
              >
                {issue.severity === 'error' ? (
                  <XCircle className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                )}
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Accordion
        className="w-full rounded-xl border bg-background px-4"
        value={openItems}
        onValueChange={(value) => setOpenItems(value as string[])}
      >
        {PRODUCT_TYPES.map((type) => {
          const selection = selections[type.key];
          const Icon = PRODUCT_TYPE_ICONS[type.key];
          return (
            <AccordionItem key={type.key} value={type.key}>
              <AccordionTrigger>
                <div className="flex flex-1 items-center gap-3 pr-4">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                      selection
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="font-medium">{type.label}</span>
                  <span className="ml-auto text-right text-sm text-muted-foreground">
                    {selection ? (
                      <span className="flex items-center gap-1.5 text-foreground">
                        <CheckCircle2 className="size-4 text-primary" />
                        {selection.product.name} × {selection.quantity} —{' '}
                        {formatPrice(selection.product.price * selection.quantity)}
                      </span>
                    ) : (
                      'Chưa chọn'
                    )}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <BuildSection
                  typeKey={type.key}
                  selection={selection}
                  onSelect={(product, quantity) =>
                    selectProduct(type.key, product, quantity)
                  }
                  onRemove={() => removeSelection(type.key)}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {selectedEntries.length}/8 loại
            </Badge>
            <p className="text-lg font-semibold">
              Tổng: <span className="text-primary">{formatPrice(totalPrice)}</span>
            </p>
          </div>
          <Button onClick={handleAddAllToCart} disabled={isSubmitting} className="gap-2">
            <ShoppingCart className="size-4" />
            Thêm tất cả vào giỏ hàng
          </Button>
        </div>
      </div>
    </div>
  );
}

function BuildSection({
  typeKey,
  selection,
  onSelect,
  onRemove,
}: {
  typeKey: ProductTypeKey;
  selection: Selection | undefined;
  onSelect: (product: Product, quantity: number) => void;
  onRemove: () => void;
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
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-3">
      {selection && (
        <div className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
          <span>
            Đã chọn: {selection.product.name} × {selection.quantity}
          </span>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            Bỏ chọn
          </Button>
        </div>
      )}

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
        renderAction={(product) => (
          <div className="flex w-full items-center gap-2" onClick={(e) => e.preventDefault()}>
            <Input
              type="number"
              min={1}
              max={product.stock}
              defaultValue={1}
              className="w-16"
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
            <Button
              size="sm"
              className="flex-1"
              disabled={product.stock <= 0}
              onClick={() => onSelect(product, quantity)}
            >
              {selection?.product.id === product.id ? 'Đã chọn' : 'Chọn'}
            </Button>
          </div>
        )}
      />
    </div>
  );
}
