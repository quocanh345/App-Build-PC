import { Badge } from '@/components/ui/badge';
import type { ComplaintStatus } from './api';

export const COMPLAINT_STATUS_LABEL: Record<ComplaintStatus, string> = {
  open: 'Chờ xử lý',
  in_progress: 'Đang xử lý',
  resolved: 'Đã giải quyết',
  rejected: 'Từ chối',
};

const COMPLAINT_STATUS_CLASS: Record<ComplaintStatus, string> = {
  open: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <Badge className={COMPLAINT_STATUS_CLASS[status]}>
      {COMPLAINT_STATUS_LABEL[status]}
    </Badge>
  );
}
