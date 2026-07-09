import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_LABEL } from './status';
import type { OrderStatusHistoryEntry } from './api';

export function OrderStatusTimeline({
  history,
}: {
  history: OrderStatusHistoryEntry[];
}) {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có lịch sử trạng thái.</p>;
  }

  return (
    <ol className="flex flex-col">
      {history.map((entry, index) => {
        const isCancelled = entry.status === 'cancelled';
        const isLast = index === history.length - 1;
        return (
          <li key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full',
                  isCancelled
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-primary text-primary-foreground',
                )}
              >
                {isCancelled ? (
                  <X className="size-3.5" />
                ) : (
                  <Check className="size-3.5" />
                )}
              </span>
              {!isLast && <span className="w-px flex-1 bg-border" />}
            </div>
            <div className={cn('flex flex-col gap-0.5', !isLast && 'pb-4')}>
              <p className="text-sm font-medium">{STATUS_LABEL[entry.status]}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(entry.createdAt).toLocaleString('vi-VN')}
              </p>
              {entry.note && (
                <p className="text-xs text-muted-foreground italic">
                  &ldquo;{entry.note}&rdquo;
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
