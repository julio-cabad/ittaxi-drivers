import { AuthUser, AuthResponse } from './user';
import { LoginFormData, RegisterFormData } from './credentials';

export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  login: (credentials: LoginFormData) => Promise<AuthResponse>;
  register: (userData: RegisterFormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}