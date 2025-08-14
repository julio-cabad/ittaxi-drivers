import { FormikProps } from 'formik';

// Auth Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

// Auth Form Component Props Types
export interface LoginFormContentProps {
  formik: FormikProps<LoginFormData>;
  onSubmit: (values: LoginFormData) => Promise<void>;
  loading?: boolean;
}

export interface RegisterFormContentProps {
  formik: FormikProps<RegisterFormData>;
  onSubmit: (values: RegisterFormData) => Promise<void>;
}

// Auth Response Types
export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  createdAt: string; // ISO string para ser serializable en Redux
  lastLoginAt: string; // ISO string para ser serializable en Redux
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: {
    code: string;
    message: string;
  };
}

// Auth Hook Types
export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  login: (credentials: LoginFormData) => Promise<AuthResponse>;
  register: (userData: RegisterFormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}