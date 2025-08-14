/**
 * Onboarding Redux state types
 * State management interfaces for the onboarding feature
 */

import type { SyncStatus } from '../../common/database';
import type { OnboardingUserData } from './models';

export interface StepCompletionTimes {
  [stepNumber: number]: string; // ISO strings
}

export interface StepValidation {
  [stepNumber: number]: boolean;
}

export interface OnboardingState {
  // Progress tracking
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  progress: number; // 0-100%
  
  // User data
  userId: string | null;
  userData: OnboardingUserData;
  
  // Enhanced timestamp tracking
  createdAt?: string;           // ISO string
  lastSavedAt: string | null;   // ISO string
  completedAt?: string;         // ISO string
  submittedAt?: string;         // ISO string
  syncStatus: SyncStatus;
  
  // Step completion tracking
  stepCompletionTimes?: StepCompletionTimes;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Validation
  stepValidation: StepValidation;
}

export interface OnboardingSliceState extends OnboardingState {
  // Additional slice-specific state can go here
  initialized: boolean;
  lastAction?: string;
}