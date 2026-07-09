import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts, fetchProductById } from './api';

export function useProductList(typeKey: string) {
  return useQuery({
    queryKey: ['products', typeKey],
    queryFn: () => fetchAllProducts(typeKey),
  });
}

export function useProductDetail(typeKey: string, id: string | undefined) {
  return useQuery({
    queryKey: ['product', typeKey, id],
    queryFn: () => fetchProductById(typeKey, id as string),
    enabled: !!id,
  });
}
