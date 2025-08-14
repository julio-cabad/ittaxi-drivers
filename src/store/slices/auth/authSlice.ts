import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser, RegisterFormData, LoginFormData } from '../../../types/auth';
import { firebaseAuthService } from '../../../services/FirebaseAuthService';

// Auth State Interface
export interface AuthState {
  // User data
  user: AuthUser | null;
  isAuthenticated: boolean;
  
  // Loading states
  isLoading: boolean;
  isRegistering: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  
  // Error handling
  error: string | null;
  lastError: string | null;
  
  // Session management
  sessionExpired: boolean;
  lastActivity: string | null;
  
  // Email verification
  emailVerificationSent: boolean;
  
  // Password reset
  passwordResetSent: boolean;
}

const initialState: AuthState = {
  // User data
  user: null,
  isAuthenticated: false,
  
  // Loading states
  isLoading: false,
  isRegistering: false,
  isLoggingIn: false,
  isLoggingOut: false,
  
  // Error handling
  error: null,
  lastError: null,
  
  // Session management
  sessionExpired: false,
  lastActivity: null,
  
  // Email verification
  emailVerificationSent: false,
  
  // Password reset
  passwordResetSent: false,
};

// Async Thunks for Firebase Auth operations
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await firebaseAuthService.register(userData.email, userData.password);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Registration failed');
      }
      
      return response.user!;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await firebaseAuthService.login(credentials.email, credentials.password);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Login failed');
      }
      
      return response.user!;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseAuthService.logout();
      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await firebaseAuthService.resetPassword(email);
      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sendEmailVerification = createAsyncThunk(
  'auth/sendEmailVerification',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseAuthService.sendEmailVerification();
      return true;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const reloadUser = createAsyncThunk(
  'auth/reloadUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await firebaseAuthService.reloadUser();
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Direct state updates
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.lastActivity = new Date().toISOString();
      
      // Clear errors on successful auth state change
      if (action.payload) {
        state.error = null;
        state.sessionExpired = false;
      }
    },
    
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionExpired = false;
      state.lastActivity = null;
    },
    
    // Error management
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        state.lastError = action.payload;
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearAllErrors: (state) => {
      state.error = null;
      state.lastError = null;
    },
    
    // Session management
    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.sessionExpired = action.payload;
      if (action.payload) {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Email verification
    setEmailVerificationSent: (state, action: PayloadAction<boolean>) => {
      state.emailVerificationSent = action.payload;
    },
    
    // Password reset
    setPasswordResetSent: (state, action: PayloadAction<boolean>) => {
      state.passwordResetSent = action.payload;
    },
    
    // Reset auth state (for logout or app reset)
    resetAuthState: (state) => {
      return { ...initialState };
    },
    
    // Initialize auth state (for app startup)
    initializeAuth: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      
      if (action.payload) {
        state.lastActivity = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegistering = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegistering = false;
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.lastActivity = new Date().toISOString();
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegistering = false;
        state.isLoading = false;
        state.error = action.payload as string;
        state.lastError = action.payload as string;
      });

    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoggingIn = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.sessionExpired = false;
        state.lastActivity = new Date().toISOString();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.isLoading = false;
        state.error = action.payload as string;
        state.lastError = action.payload as string;
      });

    // Logout User
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.sessionExpired = false;
        state.lastActivity = null;
        state.emailVerificationSent = false;
        state.passwordResetSent = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoggingOut = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.passwordResetSent = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetSent = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.passwordResetSent = false;
      });

    // Send Email Verification
    builder
      .addCase(sendEmailVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendEmailVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.emailVerificationSent = true;
        state.error = null;
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reload User
    builder
      .addCase(reloadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reloadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(reloadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setUser,
  clearUser,
  setError,
  clearError,
  clearAllErrors,
  setSessionExpired,
  updateLastActivity,
  setLoading,
  setEmailVerificationSent,
  setPasswordResetSent,
  resetAuthState,
  initializeAuth,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectAuthState = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectIsRegistering = (state: { auth: AuthState }) => state.auth.isRegistering;
export const selectIsLoggingIn = (state: { auth: AuthState }) => state.auth.isLoggingIn;
export const selectIsLoggingOut = (state: { auth: AuthState }) => state.auth.isLoggingOut;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectLastError = (state: { auth: AuthState }) => state.auth.lastError;
export const selectSessionExpired = (state: { auth: AuthState }) => state.auth.sessionExpired;
export const selectEmailVerificationSent = (state: { auth: AuthState }) => state.auth.emailVerificationSent;
export const selectPasswordResetSent = (state: { auth: AuthState }) => state.auth.passwordResetSent;
export const selectLastActivity = (state: { auth: AuthState }) => state.auth.lastActivity;