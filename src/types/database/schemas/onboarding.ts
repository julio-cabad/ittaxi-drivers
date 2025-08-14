/**
 * Onboarding database schema types
 */

export interface OnboardingDataSchema {
  _id: string;
  userId: string;
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  progress: number;
  personalData?: string; // JSON string
  vehicleData?: string;
  documentsData?: string;
  photosData?: string;
  createdAt: Date;
  lastSavedAt: Date;
  completedAt?: Date;
  submittedAt?: Date;
  syncStatus: string;
  stepCompletionTimes?: string;
  stepValidation?: string;
}

// Placeholder - add other onboarding schema types when needed