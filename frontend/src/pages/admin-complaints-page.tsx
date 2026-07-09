import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquareWarning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAllComplaints, useRespondComplaint } from '@/features/complaints/hooks';
import { COMPLAINT_STATUS_LABEL, ComplaintStatusBadge } from '@/features/complaints/status';
import type { Complaint, ComplaintStatus } from '@/features/complaints/api';
import { AdminNav } from '@/components/layout/admin-nav';
import { getErrorMessage } from '@/lib/errors';

const STATUS_OPTIONS: ComplaintStatus[] = ['open', 'in_progress', 'resolved', 'rejected'];

export function AdminComplaintsPage() {
  const { data: complaints, isLoading, error } = useAllComplaints();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageSquareWarning className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">Khiếu nại</h1>
      </div>

      <AdminNav />

      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      )}
      {error && <p className="text-sm text-destructive">Không tải được khiếu nại.</p>}
      {complaints && complaints.length === 0 && (
        <p className="text-sm text-muted-foreground">Chưa có khiếu nại nào.</p>
      )}

      {complaints?.map((complaint) => (
        <ComplaintCard key={complaint.id} complaint={complaint} />
      ))}
    </div>
  );
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [response, setResponse] = useState(complaint.adminResponse ?? '');
  const respondComplaint = useRespondComplaint();

  function handleSave() {
    respondComplaint.mutate(
      { id: complaint.id, status, adminResponse: response.trim() || undefined },
      {
        onSuccess: () => toast.success('Đã cập nhật khiếu nại'),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-background p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{complaint.subject}</p>
          <Link
            to={`/orders/${complaint.orderId}`}
            className="text-xs text-muted-foreground hover:underline"
          >
            Đơn #{complaint.orderId.slice(0, 8)} · Khách hàng{' '}
            {complaint.userId.slice(0, 8)} ·{' '}
            {new Date(complaint.createdAt).toLocaleString('vi-VN')}
          </Link>
        </div>
        <ComplaintStatusBadge status={complaint.status} />
      </div>

      <p className="text-sm text-muted-foreground">{complaint.description}</p>

      <Separator />

      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Phản hồi cho khách hàng..."
          rows={3}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v) => setStatus(v as ComplaintStatus)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {COMPLAINT_STATUS_LABEL[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" disabled={respondComplaint.isPending} onClick={handleSave}>
            Lưu phản hồi
          </Button>
        </div>
      </div>
    </div>
  );
}
