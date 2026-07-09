import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProductList } from '@/features/products/hooks';
import {
  useCreateProduct,
  useRemoveProduct,
  useUpdateProduct,
} from '@/features/products/admin-hooks';
import { ProductForm } from '@/features/products/product-form';
import {
  COMMON_FORM_FIELDS,
  PRODUCT_TYPES,
  findProductTypeConfig,
} from '@/features/products/product-types';
import type { Product } from '@/features/products/api';
import { formatPrice } from '@/lib/format';
import { getErrorMessage } from '@/lib/errors';
import { AdminNav } from '@/components/layout/admin-nav';

export function AdminProductsPage() {
  const { type } = useParams<{ type: string }>();
  const config = findProductTypeConfig(type ?? '');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutGrid className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">Quản lý sản phẩm</h1>
      </div>

      <AdminNav />

      <div className="flex flex-wrap gap-2 border-b pb-2 text-sm">
        {PRODUCT_TYPES.map((t) => (
          <NavLink
            key={t.key}
            to={`/admin/products/${t.key}`}
            className={({ isActive }) =>
              isActive
                ? 'rounded-md bg-primary px-3 py-1 text-primary-foreground'
                : 'rounded-md px-3 py-1 text-muted-foreground hover:bg-muted'
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      {!config ? (
        <p className="text-sm text-destructive">Loại sản phẩm không tồn tại.</p>
      ) : (
        <AdminProductTable typeKey={config.key} label={config.label} />
      )}
    </div>
  );
}

function AdminProductTable({ typeKey, label }: { typeKey: string; label: string }) {
  const config = findProductTypeConfig(typeKey)!;
  const fields = [...COMMON_FORM_FIELDS, ...config.formFields];

  const { data: products, isLoading, error } = useProductList(typeKey);
  const createProduct = useCreateProduct(typeKey);
  const updateProduct = useUpdateProduct(typeKey);
  const removeProduct = useRemoveProduct(typeKey);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function handleCreate(values: Record<string, unknown>) {
    createProduct.mutate(values, {
      onSuccess: () => {
        toast.success(`Đã thêm ${label}`);
        setIsCreating(false);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  function handleUpdate(values: Record<string, unknown>) {
    if (!editingProduct) return;
    updateProduct.mutate(
      { id: editingProduct.id, input: values },
      {
        onSuccess: () => {
          toast.success(`Đã cập nhật ${label}`);
          setEditingProduct(null);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  function handleRemove(product: Product) {
    if (!confirm(`Xoá "${product.name}"?`)) return;
    removeProduct.mutate(product.id, {
      onSuccess: () => toast.success(`Đã xoá ${label}`),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)}>Thêm {label}</Button>
      </div>

      {isLoading && <Skeleton className="h-64 w-full rounded-xl" />}
      {error && <p className="text-sm text-destructive">Không tải được danh sách.</p>}

      {products && (
        <Table className="rounded-xl border bg-background">
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Hãng</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.manufacturer}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(product)}
                  >
                    Xoá
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm {label}</DialogTitle>
          </DialogHeader>
          <ProductForm
            fields={fields}
            onSubmit={handleCreate}
            isSubmitting={createProduct.isPending}
            submitLabel="Thêm mới"
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sửa {label}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              fields={fields}
              defaultValues={editingProduct}
              onSubmit={handleUpdate}
              isSubmitting={updateProduct.isPending}
              submitLabel="Cập nhật"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
