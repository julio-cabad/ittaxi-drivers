import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  sendEmailVerification,
  reloadUser,
  setUser,
  clearError,
  clearAllErrors,
  setSessionExpired,
  updateLastActivity,
  initializeAuth,
  selectAuthState,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsRegistering,
  selectIsLoggingIn,
  selectIsLoggingOut,
  selectAuthError,
  selectEmailVerificationSent,
  selectPasswordResetSent,
} from '../store/slices/auth';
import { RegisterFormData, LoginFormData, AuthUser } from '../types/auth';
import { firebaseAuthService } from '../services/FirebaseAuthService';

/**
 * Custom hook for Firebase Authentication with Redux integration
 * Provides a clean interface for all authentication operations
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const authState = useSelector(selectAuthState);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const isRegistering = useSelector(selectIsRegistering);
  const isLoggingIn = useSelector(selectIsLoggingIn);
  const isLoggingOut = useSelector(selectIsLoggingOut);
  const error = useSelector(selectAuthError);
  const emailVerificationSent = useSelector(selectEmailVerificationSent);
  const passwordResetSent = useSelector(selectPasswordResetSent);

  /**
   * Initialize authentication state on app startup
   */
  const initializeAuthentication = useCallback(() => {
    const currentUser = firebaseAuthService.getCurrentUser();
    dispatch(initializeAuth(currentUser));
  }, [dispatch]);

  /**
   * Set up Firebase auth state listener
   */
  const setupAuthListener = useCallback(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged(
      (user: AuthUser | null) => {
        dispatch(setUser(user));
      },
    );

    return unsubscribe;
  }, [dispatch]);

  /**
   * Register a new user
   */
  const register = async (userData: RegisterFormData) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      return { success: true, user: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginFormData) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      return { success: true, user: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  /**
   * Send password reset email
   */
  const sendPasswordReset = useCallback(
    async (email: string) => {
      try {
        await dispatch(resetPassword(email)).unwrap();
        return { success: true };
      } catch (error) {
        return { success: false, error: error as string };
      }
    },
    [dispatch],
  );

  /**
   * Send email verification
   */
  const sendVerificationEmail = useCallback(async () => {
    try {
      await dispatch(sendEmailVerification()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  /**
   * Reload user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const result = await dispatch(reloadUser()).unwrap();
      return { success: true, user: result };
    } catch (error) {
      return { success: false, error: error as string };
    }
  }, [dispatch]);

  /**
   * Clear authentication errors
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Clear all authentication errors
   */
  const clearAllAuthErrors = useCallback(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  /**
   * Update user activity timestamp
   */
  const trackActivity = useCallback(() => {
    dispatch(updateLastActivity());
  }, [dispatch]);

  /**
   * Handle session expiration
   */
  const handleSessionExpired = useCallback(() => {
    dispatch(setSessionExpired(true));
  }, [dispatch]);

  /**
   * Check if user email is verified
   */
  const isEmailVerified = useCallback((): boolean => {
    return user?.emailVerified || false;
  }, [user]);

  /**
   * Get user display name or email
   */
  const getUserDisplayName = useCallback((): string => {
    if (!user) return '';
    return user.displayName || user.email || 'Usuario';
  }, [user]);

  /**
   * Check if user needs to complete onboarding
   */
  const needsOnboarding = useCallback((): boolean => {
    // This can be expanded based on your onboarding requirements
    return isAuthenticated && !user?.displayName;
  }, [isAuthenticated, user]);

  /**
   * Get authentication status summary
   */
  const getAuthStatus = useCallback(() => {
    return {
      isAuthenticated,
      isLoading: isLoading || isRegistering || isLoggingIn || isLoggingOut,
      hasError: !!error,
      needsEmailVerification: isAuthenticated && !isEmailVerified(),
      needsOnboarding: needsOnboarding(),
    };
  }, [
    isAuthenticated,
    isLoading,
    isRegistering,
    isLoggingIn,
    isLoggingOut,
    error,
    isEmailVerified,
    needsOnboarding,
  ]);

  // Set up auth listener on mount
  useEffect(() => {
    initializeAuthentication();
    const unsubscribe = setupAuthListener();

    return () => {
      unsubscribe();
    };
  }, [initializeAuthentication, setupAuthListener]);

  // Auto-track activity when user interacts
  useEffect(() => {
    if (isAuthenticated) {
      trackActivity();
    }
  }, [isAuthenticated, trackActivity]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    isRegistering,
    isLoggingIn,
    isLoggingOut,
    error,
    emailVerificationSent,
    passwordResetSent,
    authState,

    // Actions
    register,
    login,
    logout,
    sendPasswordReset,
    sendVerificationEmail,
    refreshUser,
    clearAuthError,
    clearAllAuthErrors,
    trackActivity,
    handleSessionExpired,

    // Utilities
    isEmailVerified,
    getUserDisplayName,
    needsOnboarding,
    getAuthStatus,
    initializeAuthentication,
  };
};
