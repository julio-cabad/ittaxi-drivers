import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import base API (external APIs will inject their endpoints)
import { baseApi } from '../api/base/baseApi';

// Import regular Redux slices
import onboardingReducer from './slices/onboarding/onboardingSlice';
import authReducer from './slices/auth/authSlice';

export const store = configureStore({
  reducer: {
    // Regular slices for UI state management
    onboarding: onboardingReducer,
    auth: authReducer,
    
    // Single API reducer for all external RTK Query APIs
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
