import { GraphQLClient } from 'graphql-request';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/graphql';

// Access token sống trong bộ nhớ (không localStorage) để tránh bị đánh cắp qua XSS.
// refreshToken nằm trong cookie httpOnly, trình duyệt tự gửi kèm request nên không cần code gì thêm.
let accessToken: string | null = null;
type TokenListener = (token: string | null) => void;
const listeners = new Set<TokenListener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  listeners.forEach((listener) => listener(token));
}

export function onAccessTokenChange(listener: TokenListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const client = new GraphQLClient(API_URL, {
  credentials: 'include',
});

// Gọi GraphQL, tự gắn Authorization header và tự cập nhật access token mới
// nếu backend trả về header X-Access-Token (nghĩa là access token cũ đã hết hạn và được làm mới bằng refresh token).
export async function gqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  client.setHeaders(
    accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  );

  const { data, headers } = await client.rawRequest<T>(query, variables);

  const refreshedToken = headers.get('x-access-token');
  if (refreshedToken) {
    setAccessToken(refreshedToken);
  }

  return data;
}
