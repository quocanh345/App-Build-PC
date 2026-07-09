import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { verifyEmailRequest } from '@/features/auth/api';
import { getErrorMessage } from '@/lib/errors';

type Status = 'loading' | 'success' | 'error';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'error');
  const [message, setMessage] = useState('');
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;
    verifyEmailRequest(token)
      .then(() => setStatus('success'))
      .catch((error: unknown) => {
        setStatus('error');
        setMessage(getErrorMessage(error));
      });
  }, [token]);

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center py-10">
      <Card className="w-full">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {status === 'loading' && <Loader2 className="size-6 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="size-6" />}
            {status === 'error' && <XCircle className="size-6 text-destructive" />}
          </span>
          <CardTitle className="text-xl">Xác thực email</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Đang xác thực email của bạn...'}
            {status === 'success' && 'Email của bạn đã được xác thực thành công'}
            {status === 'error' &&
              (message || 'Liên kết xác thực không hợp lệ hoặc đã hết hạn')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/" className="font-medium text-primary underline">
              Về trang chủ
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
