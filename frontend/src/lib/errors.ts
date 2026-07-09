import { ClientError } from 'graphql-request';

export function getErrorMessage(error: unknown): string {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? 'Đã có lỗi xảy ra';
  }
  if (error instanceof Error) return error.message;
  return 'Đã có lỗi xảy ra';
}
