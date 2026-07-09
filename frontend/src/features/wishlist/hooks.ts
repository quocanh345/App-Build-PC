import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import { fetchMyWishlist, toggleWishlistRequest } from './api';
import type { ProductTypeKey } from '../products/product-types';

const WISHLIST_QUERY_KEY = ['wishlist'];

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: fetchMyWishlist,
    enabled: isAuthenticated,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ typeKey, productId }: { typeKey: ProductTypeKey; productId: string }) =>
      toggleWishlistRequest(typeKey, productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY }),
  });
}
