import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import {
  createComplaintRequest,
  fetchAllComplaints,
  fetchMyComplaints,
  fetchOrderComplaints,
  respondComplaintRequest,
  type ComplaintStatus,
} from './api';

export function useMyComplaints() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['complaints', 'mine'],
    queryFn: fetchMyComplaints,
    enabled: isAuthenticated,
  });
}

export function useOrderComplaints(orderId: string | undefined) {
  return useQuery({
    queryKey: ['complaints', 'order', orderId],
    queryFn: () => fetchOrderComplaints(orderId as string),
    enabled: !!orderId,
  });
}

export function useAllComplaints() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['complaints', 'all'],
    queryFn: fetchAllComplaints,
    enabled: user?.role === 'admin',
  });
}

export function useCreateComplaint(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { subject: string; description: string }) =>
      createComplaintRequest({ orderId, ...input }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['complaints', 'order', orderId] });
      void queryClient.invalidateQueries({ queryKey: ['complaints', 'mine'] });
    },
  });
}

export function useRespondComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      adminResponse,
    }: {
      id: string;
      status: ComplaintStatus;
      adminResponse?: string;
    }) => respondComplaintRequest(id, status, adminResponse),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['complaints'] }),
  });
}
