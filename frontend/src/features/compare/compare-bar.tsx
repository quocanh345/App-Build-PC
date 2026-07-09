import { Link } from 'react-router-dom';
import { Scale, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from './compare-context';

export function CompareBar() {
  const { ids, clear } = useCompare();

  if (ids.length === 0) return null;

  return (
    <div className="sticky bottom-0 z-30 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Scale className="size-4 text-primary" />
          Đang so sánh {ids.length} sản phẩm
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clear} className="gap-1">
            <X className="size-4" />
            Xoá
          </Button>
          <Link to="/compare">
            <Button size="sm">Xem so sánh</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
