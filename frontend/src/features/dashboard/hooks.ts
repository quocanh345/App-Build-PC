import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import { fetchDashboardStats } from './api';

export function useDashboardStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: fetchDashboardStats,
    enabled: user?.role === 'admin',
  });
}
