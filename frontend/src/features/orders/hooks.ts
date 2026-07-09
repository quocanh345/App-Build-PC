import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import {
  cancelOrderRequest,
  fetchAllOrders,
  fetchMyOrders,
  fetchOrderById,
  updateOrderStatusRequest,
  type OrderStatus,
} from './api';

export function useMyOrders() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrders,
    enabled: isAuthenticated,
    // Poll định kỳ để trang Đơn hàng tự cập nhật, và để phát hiện thay đổi trạng thái
    // cho thông báo native trên desktop (xem use-order-status-notifications.ts).
    refetchInterval: 30_000,
  });
}

export function useAllOrders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: fetchAllOrders,
    enabled: user?.role === 'admin',
  });
}

export function useOrderDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id as string),
    enabled: !!id,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOrderRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: OrderStatus;
      note?: string;
    }) => updateOrderStatusRequest(id, status, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}
