import { PersonalData } from './personal';
import { VehicleData } from './vehicle';
import { DocumentsData, PhotosData } from './documents';

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  progress: number;
  completedSteps?: number[];

  userId: string | null;
  userData: {
    personal: PersonalData | null;
    vehicle: VehicleData | null;
    documents: DocumentsData | null;
    photos: PhotosData | null;
  };

  createdAt?: string;
  lastSavedAt: string | null;
  completedAt?: string;
  submittedAt?: string;
  syncStatus: 'synced' | 'pending' | 'error' | 'offline';

  stepCompletionTimes?: {
    [stepNumber: number]: string;
  };

  isLoading: boolean;
  error: string | null;

  stepValidation: {
    [stepNumber: number]: boolean;
  };
}

export interface OnboardingStatus {
  status:
    | 'draft'
    | 'submitted'
    | 'under_review'
    | 'approved'
    | 'rejected'
    | 'requires_changes';
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  requiredChanges?: string[];
  estimatedReviewTime?: number;
}

export interface OnboardingProgress {
  userId: string;
  currentStep: string;
  completedSteps: string[];
  lastSavedAt: Date;
}