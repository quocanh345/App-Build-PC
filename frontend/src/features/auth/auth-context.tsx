import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  getAccessToken,
  onAccessTokenChange,
  setAccessToken,
} from '@/lib/graphql-client';
import { decodeJwtPayload, type JwtPayload } from './jwt';
import {
  loginRequest,
  logoutRequest,
  refreshTokenRequest,
  registerRequest,
  type RegisterInput,
} from './api';

interface AuthContextValue {
  user: JwtPayload | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(() => {
    const token = getAccessToken();
    return token ? decodeJwtPayload(token) : null;
  });
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    return onAccessTokenChange((token) => {
      setUser(token ? decodeJwtPayload(token) : null);
    });
  }, []);

  useEffect(() => {
    // Sau khi tải lại trang, accessToken trong bộ nhớ đã mất — thử xin lại
    // bằng refreshToken (cookie httpOnly) trước khi coi như user đã đăng xuất.
    refreshTokenRequest()
      .then((accessToken) => setAccessToken(accessToken))
      .catch(() => setAccessToken(null))
      .finally(() => setIsInitializing(false));
  }, []);

  async function login(email: string, password: string) {
    const { accessToken } = await loginRequest(email, password);
    setAccessToken(accessToken);
  }

  async function register(input: RegisterInput) {
    const { accessToken } = await registerRequest(input);
    setAccessToken(accessToken);
  }

  async function logout() {
    try {
      await logoutRequest();
    } finally {
      setAccessToken(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return ctx;
}
