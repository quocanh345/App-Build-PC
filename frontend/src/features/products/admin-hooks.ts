import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProductRequest,
  removeProductRequest,
  updateProductRequest,
} from './admin-api';

export function useCreateProduct(typeKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Record<string, unknown>) =>
      createProductRequest(typeKey, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['products', typeKey] }),
  });
}

export function useUpdateProduct(typeKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Record<string, unknown> }) =>
      updateProductRequest(typeKey, id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['products', typeKey] }),
  });
}

export function useRemoveProduct(typeKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeProductRequest(typeKey, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['products', typeKey] }),
  });
}
