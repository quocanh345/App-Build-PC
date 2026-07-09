import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StarRating({
  value,
  onChange,
  size = 'sm',
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = size === 'lg' ? 'size-6' : size === 'md' ? 'size-5' : 'size-4';
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={cn(!interactive && 'cursor-default')}
        >
          <Star
            className={cn(
              sizeClass,
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-muted-foreground',
            )}
          />
        </button>
      ))}
    </div>
  );
}
