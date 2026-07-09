import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import {
  addToCartRequest,
  checkoutCartRequest,
  clearCartRequest,
  fetchMyCart,
  removeCartItemRequest,
  updateCartItemQuantityRequest,
  type CheckoutInput,
} from './api';
import type { ProductTypeKey } from '../products/product-types';

const CART_QUERY_KEY = ['cart'];

export function useCart() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchMyCart,
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      productType: ProductTypeKey;
      productId: string;
      quantity: number;
    }) => addToCartRequest(input),
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemQuantityRequest(itemId, quantity),
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItemRequest(itemId),
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCartRequest,
    onSuccess: (data) => queryClient.setQueryData(CART_QUERY_KEY, data),
  });
}

export function useCheckoutCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CheckoutInput) => checkoutCartRequest(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  });
}
