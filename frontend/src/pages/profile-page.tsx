import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { UserRound, Mail, Phone, Lock, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMyAccount, useMyProfile } from '@/features/user/hooks';
import {
  useChangeEmail,
  useChangePassword,
  useChangePhoneNumber,
  useResendVerificationEmail,
  useUpdateProfile,
} from '@/features/user/hooks';
import { getErrorMessage } from '@/lib/errors';

const profileSchema = z.object({
  username: z.string().min(1, 'Tên hiển thị không được để trống'),
  address: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const emailSchema = z.object({ newEmail: z.string().email('Email không hợp lệ') });
type EmailFormValues = z.infer<typeof emailSchema>;

const phoneSchema = z.object({
  newPhoneNumber: z.string().min(9, 'Số điện thoại không hợp lệ'),
});
type PhoneFormValues = z.infer<typeof phoneSchema>;

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const { data: account, isLoading: isAccountLoading } = useMyAccount();

  if (isProfileLoading || isAccountLoading) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4 py-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 py-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UserRound className="size-5" />
        </span>
        <h1 className="text-xl font-semibold">Hồ sơ cá nhân</h1>
      </div>

      {account && !account.isVerified && (
        <VerificationBanner email={account.email} />
      )}

      <ProfileForm username={profile?.username ?? ''} address={profile?.address ?? ''} />
      <EmailForm currentEmail={account?.email ?? ''} />
      <PhoneForm currentPhone={account?.phoneNumber ?? ''} />
      <PasswordForm />
    </div>
  );
}

function VerificationBanner({ email }: { email: string }) {
  const resendVerificationEmail = useResendVerificationEmail();

  function handleResend() {
    resendVerificationEmail.mutate(email, {
      onSuccess: () => toast.success('Đã gửi lại email xác thực, vui lòng kiểm tra hộp thư'),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  return (
    <Card className="border-amber-500/50 bg-amber-500/10">
      <CardContent className="flex items-center justify-between gap-3 py-4">
        <div className="flex items-center gap-2 text-sm">
          <TriangleAlert className="size-4 shrink-0 text-amber-600" />
          <span>Email của bạn chưa được xác thực.</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={resendVerificationEmail.isPending}
          onClick={handleResend}
        >
          Gửi lại email xác thực
        </Button>
      </CardContent>
    </Card>
  );
}

function ProfileForm({ username, address }: { username: string; address: string }) {
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: { username, address },
  });

  useEffect(() => {
    reset({ username, address });
  }, [username, address, reset]);

  function onSubmit(values: ProfileFormValues) {
    updateProfile.mutate(values, {
      onSuccess: () => toast.success('Đã cập nhật hồ sơ'),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
        <CardDescription>Tên hiển thị và địa chỉ giao hàng mặc định</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Tên hiển thị</Label>
            <Input id="username" {...register('username')} />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input id="address" {...register('address')} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-fit">
            Lưu thay đổi
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const changeEmail = useChangeEmail();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    values: { newEmail: currentEmail },
  });

  function onSubmit(values: EmailFormValues) {
    changeEmail.mutate(values.newEmail, {
      onSuccess: () => toast.success('Đã đổi email'),
      onError: (error) => {
        toast.error(getErrorMessage(error));
        reset({ newEmail: currentEmail });
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="size-4" /> Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="newEmail">Email đăng nhập</Label>
            <Input id="newEmail" type="email" {...register('newEmail')} />
            {errors.newEmail && (
              <p className="text-sm text-destructive">{errors.newEmail.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Cập nhật
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PhoneForm({ currentPhone }: { currentPhone: string }) {
  const changePhoneNumber = useChangePhoneNumber();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    values: { newPhoneNumber: currentPhone },
  });

  function onSubmit(values: PhoneFormValues) {
    changePhoneNumber.mutate(values.newPhoneNumber, {
      onSuccess: () => toast.success('Đã đổi số điện thoại'),
      onError: (error) => {
        toast.error(getErrorMessage(error));
        reset({ newPhoneNumber: currentPhone });
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Phone className="size-4" /> Số điện thoại
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="newPhoneNumber">Số điện thoại</Label>
            <Input id="newPhoneNumber" {...register('newPhoneNumber')} />
            {errors.newPhoneNumber && (
              <p className="text-sm text-destructive">
                {errors.newPhoneNumber.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            Cập nhật
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordForm() {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  function onSubmit(values: PasswordFormValues) {
    changePassword.mutate(
      { oldPassword: values.oldPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success('Đã đổi mật khẩu');
          reset();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lock className="size-4" /> Đổi mật khẩu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
            <Input id="oldPassword" type="password" {...register('oldPassword')} />
            {errors.oldPassword && (
              <p className="text-sm text-destructive">{errors.oldPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input id="newPassword" type="password" {...register('newPassword')} />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-fit">
            Đổi mật khẩu
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
