import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateComplaint, useOrderComplaints } from './hooks';
import { ComplaintStatusBadge } from './status';
import { getErrorMessage } from '@/lib/errors';
import type { OrderStatus } from '../orders/api';

// Chỉ đơn đã/đang xử lý thật sự mới cho khiếu nại — đơn pending/cancelled thì chưa
// có gì để khiếu nại.
const COMPLAINABLE_STATUSES: OrderStatus[] = ['confirmed', 'shipping', 'completed'];

export function ComplaintSection({
  orderId,
  orderStatus,
}: {
  orderId: string;
  orderStatus: OrderStatus;
}) {
  const { data: complaints, isLoading } = useOrderComplaints(orderId);
  const [open, setOpen] = useState(false);

  const canComplain = COMPLAINABLE_STATUSES.includes(orderStatus);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-medium">
          <MessageSquareWarning className="size-4" />
          Khiếu nại
        </h2>
        {canComplain && (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Gửi khiếu nại
          </Button>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Đang tải...</p>}

      {complaints && complaints.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Chưa có khiếu nại nào cho đơn hàng này.
        </p>
      )}

      {complaints && complaints.length > 0 && (
        <ul className="flex flex-col gap-3">
          {complaints.map((complaint) => (
            <li key={complaint.id} className="flex flex-col gap-1.5 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{complaint.subject}</p>
                <ComplaintStatusBadge status={complaint.status} />
              </div>
              <p className="text-sm text-muted-foreground">{complaint.description}</p>
              {complaint.adminResponse && (
                <div className="mt-1 rounded-md bg-muted p-2 text-sm">
                  <span className="font-medium">Phản hồi từ shop: </span>
                  {complaint.adminResponse}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(complaint.createdAt).toLocaleString('vi-VN')}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ComplaintDialog orderId={orderId} open={open} onOpenChange={setOpen} />
    </div>
  );
}

function ComplaintDialog({
  orderId,
  open,
  onOpenChange,
}: {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const createComplaint = useCreateComplaint(orderId);

  function handleSubmit() {
    if (!subject.trim() || !description.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và mô tả');
      return;
    }
    createComplaint.mutate(
      { subject: subject.trim(), description: description.trim() },
      {
        onSuccess: () => {
          toast.success('Đã gửi khiếu nại');
          setSubject('');
          setDescription('');
          onOpenChange(false);
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gửi khiếu nại</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="complaint-subject">Tiêu đề</Label>
            <Input
              id="complaint-subject"
              placeholder="VD: Giao thiếu hàng, sản phẩm bị lỗi..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="complaint-description">Mô tả chi tiết</Label>
            <Textarea
              id="complaint-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button
            className="w-fit"
            disabled={createComplaint.isPending}
            onClick={handleSubmit}
          >
            Gửi khiếu nại
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
