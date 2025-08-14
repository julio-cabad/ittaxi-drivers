/**
 * Authentication state types
 * Redux state for authentication feature
 */

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

// Placeholder - add specific auth state types when needed