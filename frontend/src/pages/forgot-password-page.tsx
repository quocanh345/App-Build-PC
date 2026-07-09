import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { forgotPasswordRequest } from '@/features/auth/api';
import { getErrorMessage } from '@/lib/errors';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await forgotPasswordRequest(values.email);
      setSent(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center py-10">
      <Card className="w-full">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="size-6" />
          </span>
          <CardTitle className="text-xl">Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-center text-sm text-muted-foreground">
              Nếu email tồn tại trong hệ thống, một liên kết đặt lại mật khẩu đã
              được gửi tới hộp thư của bạn. Liên kết có hiệu lực trong 15 phút.
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="mt-2">
                Gửi liên kết đặt lại mật khẩu
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Nhớ mật khẩu rồi?{' '}
            <Link to="/login" className="font-medium text-primary underline">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
