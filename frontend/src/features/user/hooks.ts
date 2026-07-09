import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import { resendVerificationEmailRequest } from '../auth/api';
import {
  changeEmailRequest,
  changePasswordRequest,
  changePhoneNumberRequest,
  fetchMyAccount,
  fetchMyProfile,
  updateProfileRequest,
} from './api';

export function useMyProfile() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchMyProfile,
    enabled: isAuthenticated,
  });
}

export function useMyAccount() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['account'],
    queryFn: fetchMyAccount,
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { username?: string; address?: string }) =>
      updateProfileRequest(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
}

export function useChangeEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEmail: string) => changeEmailRequest(newEmail),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account'] }),
  });
}

export function useChangePhoneNumber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPhoneNumber: string) => changePhoneNumberRequest(newPhoneNumber),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['account'] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      changePasswordRequest(oldPassword, newPassword),
  });
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: (email: string) => resendVerificationEmailRequest(email),
  });
}
