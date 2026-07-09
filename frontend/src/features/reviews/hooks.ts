import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import type { ProductTypeKey } from '../products/product-types';
import {
  deleteReviewRequest,
  fetchMyReview,
  fetchProductReviews,
  fetchRatingSummary,
  upsertReviewRequest,
} from './api';

export function useProductReviews(typeKey: ProductTypeKey, productId: string) {
  return useQuery({
    queryKey: ['reviews', typeKey, productId],
    queryFn: () => fetchProductReviews(typeKey, productId),
  });
}

export function useRatingSummary(typeKey: ProductTypeKey, productId: string) {
  return useQuery({
    queryKey: ['rating-summary', typeKey, productId],
    queryFn: () => fetchRatingSummary(typeKey, productId),
  });
}

export function useMyReview(typeKey: ProductTypeKey, productId: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['my-review', typeKey, productId],
    queryFn: () => fetchMyReview(typeKey, productId),
    enabled: isAuthenticated,
  });
}

export function useUpsertReview(typeKey: ProductTypeKey, productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { rating: number; comment?: string }) =>
      upsertReviewRequest({ productType: typeKey, productId, ...input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', typeKey, productId] });
      void queryClient.invalidateQueries({
        queryKey: ['rating-summary', typeKey, productId],
      });
      void queryClient.invalidateQueries({
        queryKey: ['my-review', typeKey, productId],
      });
    },
  });
}

export function useDeleteReview(typeKey: ProductTypeKey, productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReviewRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews', typeKey, productId] });
      void queryClient.invalidateQueries({
        queryKey: ['rating-summary', typeKey, productId],
      });
      void queryClient.invalidateQueries({
        queryKey: ['my-review', typeKey, productId],
      });
    },
  });
}
