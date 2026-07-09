export interface JwtPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// Chỉ đọc payload để hiển thị UI (vd: có hiện menu admin hay không).
// Không xác thực chữ ký ở đây — việc phân quyền thật sự luôn do backend (AuthGuard/RolesGuard) quyết định.
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    const parsed = JSON.parse(json) as Partial<JwtPayload>;
    if (!parsed.id || !parsed.email || !parsed.role) return null;
    return { id: parsed.id, email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}
