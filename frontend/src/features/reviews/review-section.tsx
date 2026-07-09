import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/features/auth/auth-context';
import { getErrorMessage } from '@/lib/errors';
import { StarRating } from './star-rating';
import {
  useDeleteReview,
  useMyReview,
  useProductReviews,
  useRatingSummary,
  useUpsertReview,
} from './hooks';
import type { ProductTypeKey } from '../products/product-types';

export function ReviewSection({
  typeKey,
  productId,
}: {
  typeKey: ProductTypeKey;
  productId: string;
}) {
  const { isAuthenticated, user } = useAuth();
  const { data: summary } = useRatingSummary(typeKey, productId);
  const { data: reviews, isLoading } = useProductReviews(typeKey, productId);
  const { data: myReview } = useMyReview(typeKey, productId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="font-medium">Đánh giá sản phẩm</h2>
        {summary && summary.count > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <StarRating value={Math.round(summary.average)} />
            <span>
              {summary.average}/5 ({summary.count} đánh giá)
            </span>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <ReviewForm
          typeKey={typeKey}
          productId={productId}
          initialRating={myReview?.rating}
          initialComment={myReview?.comment}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Đăng nhập để viết đánh giá cho sản phẩm này.
        </p>
      )}

      {isLoading && <Skeleton className="h-20 w-full rounded-lg" />}

      {reviews && reviews.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có đánh giá nào.</p>
      )}

      {reviews && reviews.length > 0 && (
        <ul className="flex flex-col divide-y">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-col gap-1 py-3">
              <div className="flex items-center justify-between">
                <StarRating value={review.rating} />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  {user?.id === review.userId && (
                    <DeleteReviewButton
                      typeKey={typeKey}
                      productId={productId}
                      reviewId={review.id}
                    />
                  )}
                </div>
              </div>
              {review.comment && <p className="text-sm">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReviewForm({
  typeKey,
  productId,
  initialRating,
  initialComment,
}: {
  typeKey: ProductTypeKey;
  productId: string;
  initialRating?: number;
  initialComment?: string;
}) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [comment, setComment] = useState(initialComment ?? '');
  const upsertReview = useUpsertReview(typeKey, productId);

  useEffect(() => {
    setRating(initialRating ?? 0);
    setComment(initialComment ?? '');
  }, [initialRating, initialComment]);

  function handleSubmit() {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    upsertReview.mutate(
      { rating, comment: comment.trim() || undefined },
      {
        onSuccess: () => toast.success('Đã gửi đánh giá'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-3">
      <StarRating value={rating} onChange={setRating} size="lg" />
      <Textarea
        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm (không bắt buộc)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <Button
        size="sm"
        className="w-fit"
        disabled={upsertReview.isPending}
        onClick={handleSubmit}
      >
        {initialRating ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
      </Button>
    </div>
  );
}

function DeleteReviewButton({
  typeKey,
  productId,
  reviewId,
}: {
  typeKey: ProductTypeKey;
  productId: string;
  reviewId: string;
}) {
  const deleteReview = useDeleteReview(typeKey, productId);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-6 text-muted-foreground hover:text-destructive"
      onClick={() =>
        deleteReview.mutate(reviewId, {
          onSuccess: () => toast.success('Đã xoá đánh giá'),
          onError: (error) => toast.error(getErrorMessage(error)),
        })
      }
    >
      <Trash2 className="size-3.5" />
    </Button>
  );
}
