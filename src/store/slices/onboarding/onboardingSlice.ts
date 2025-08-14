import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  OnboardingState, 
  PersonalData, 
  VehicleData, 
  DocumentsData, 
  PhotosData,
  ONBOARDING_STEPS 
} from '../../../types/onboarding';

const initialState: OnboardingState = {
  // Progress tracking
  currentStep: ONBOARDING_STEPS.REGISTER,
  totalSteps: 8,
  isCompleted: false,
  progress: 0,
  completedSteps: [],
  
  // User data
  userId: null,
  userData: {
    personal: null,
    vehicle: null,
    documents: null,
    photos: null,
  },
  
  // Sync status
  lastSavedAt: null,
  syncStatus: 'synced',
  
  // UI state
  isLoading: false,
  error: null,
  
  // Validation
  stepValidation: {},
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    // Progress management
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      state.progress = Math.round((action.payload / state.totalSteps) * 100);
    },
    
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
        state.progress = Math.round((state.currentStep / state.totalSteps) * 100);
      }
    },
    
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
        state.progress = Math.round((state.currentStep / state.totalSteps) * 100);
      }
    },
    
    // User data updates
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    
    updatePersonalData: (state, action: PayloadAction<Partial<PersonalData>>) => {
      state.userData.personal = {
        ...state.userData.personal,
        ...action.payload,
      } as PersonalData;
      state.syncStatus = 'pending';
      state.lastSavedAt = new Date().toISOString();
    },
    
    updateVehicleData: (state, action: PayloadAction<Partial<VehicleData>>) => {
      state.userData.vehicle = {
        ...state.userData.vehicle,
        ...action.payload,
      } as VehicleData;
      state.syncStatus = 'pending';
      state.lastSavedAt = new Date().toISOString();
    },
    
    updateDocumentsData: (state, action: PayloadAction<Partial<DocumentsData>>) => {
      state.userData.documents = {
        ...state.userData.documents,
        ...action.payload,
      } as DocumentsData;
      state.syncStatus = 'pending';
      state.lastSavedAt = new Date().toISOString();
    },
    
    updatePhotosData: (state, action: PayloadAction<Partial<PhotosData>>) => {
      state.userData.photos = {
        ...state.userData.photos,
        ...action.payload,
      } as PhotosData;
      state.syncStatus = 'pending';
      state.lastSavedAt = new Date().toISOString();
    },
    
    // Sync status
    setSyncStatus: (state, action: PayloadAction<OnboardingState['syncStatus']>) => {
      state.syncStatus = action.payload;
    },
    
    markAsSynced: (state) => {
      state.syncStatus = 'synced';
      state.lastSavedAt = new Date().toISOString();
    },
    
    // Validation
    setStepValidation: (state, action: PayloadAction<{ step: number; isValid: boolean }>) => {
      state.stepValidation[action.payload.step] = action.payload.isValid;
    },
    
    // UI state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Complete onboarding
    completeOnboarding: (state) => {
      state.isCompleted = true;
      state.currentStep = state.totalSteps;
      state.progress = 100;
    },
    
    // Reset onboarding
    resetOnboarding: (state) => {
      return { ...initialState, userId: state.userId };
    },
    
    // Load from storage
    loadOnboardingData: (state, action: PayloadAction<Partial<OnboardingState>>) => {
      return { ...state, ...action.payload };
    },
    
    // Update onboarding progress (for useOnboarding hook)
    updateOnboardingProgress: (state, action: PayloadAction<Partial<OnboardingState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setUserId,
  updatePersonalData,
  updateVehicleData,
  updateDocumentsData,
  updatePhotosData,
  setSyncStatus,
  markAsSynced,
  setStepValidation,
  setLoading,
  setError,
  completeOnboarding,
  resetOnboarding,
  loadOnboardingData,
  updateOnboardingProgress,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;

// Selectors
export const selectOnboardingState = (state: { onboarding: OnboardingState }) => state.onboarding;
export const selectCurrentStep = (state: { onboarding: OnboardingState }) => state.onboarding.currentStep;
export const selectProgress = (state: { onboarding: OnboardingState }) => state.onboarding.progress;
export const selectUserData = (state: { onboarding: OnboardingState }) => state.onboarding.userData;
export const selectSyncStatus = (state: { onboarding: OnboardingState }) => state.onboarding.syncStatus;
export const selectIsStepValid = (step: number) => (state: { onboarding: OnboardingState }) => 
  state.onboarding.stepValidation[step] || false;