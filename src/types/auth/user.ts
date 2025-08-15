export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: {
    code: string;
    message: string;
  };
}