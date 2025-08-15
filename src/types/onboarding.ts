// Onboarding Data Types
export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  nationalId: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
  uploadUrl?: string;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
}

export interface PhotoFile {
  id: string;
  name: string;
  uri: string;
  type:
    | 'frontal'
    | 'posterior'
    | 'lateral_izquierda'
    | 'lateral_derecha'
    | 'interior';
  uploadUrl?: string;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number;
}

export interface DocumentsData {
  cedulaFrontal: DocumentFile | null;
  cedulaPosterior: DocumentFile | null;
  licenciaConducir: DocumentFile | null;
  matriculaVehiculo: DocumentFile | null;
}

export interface PhotosData {
  frontal: PhotoFile | null;
  posterior: PhotoFile | null;
  lateralIzquierda: PhotoFile | null;
  lateralDerecha: PhotoFile | null;
  interior: PhotoFile | null;
}

export interface OnboardingState {
  // Progress tracking
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  progress: number; // 0-100%
  completedSteps?: number[]; // Array of completed step numbers

  // User data
  userId: string | null;
  userData: {
    personal: PersonalData | null;
    vehicle: VehicleData | null;
    documents: DocumentsData | null;
    photos: PhotosData | null;
  };

  // Enhanced timestamp tracking
  createdAt?: string; // ISO string
  lastSavedAt: string | null; // ISO string
  completedAt?: string; // ISO string - NEW FIELD
  submittedAt?: string; // ISO string - NEW FIELD
  syncStatus: 'synced' | 'pending' | 'error' | 'offline';

  // Step completion tracking
  stepCompletionTimes?: {
    [stepNumber: number]: string; // ISO strings
  };

  // UI state
  isLoading: boolean;
  error: string | null;

  // Validation
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
  estimatedReviewTime?: number; // hours
}

// API Payloads
export interface UpdateStepPayload {
  userId: string;
  step: number;
  data: Partial<PersonalData | VehicleData | DocumentsData | PhotosData>;
}

export interface UploadDocumentPayload {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  path: string;
  userId: string;
  documentType: keyof DocumentsData;
}

export interface UploadPhotoPayload {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  path: string;
  userId: string;
  photoType: keyof PhotosData;
}

// Step definitions
export const ONBOARDING_STEPS = {
  REGISTER: 1,
  PERSONAL_DATA: 2,
  VEHICLE_DATA: 3,
  VEHICLE_PHOTOS: 4,
  DOCUMENTS_UPLOAD: 5,
  REVIEW_SUBMIT: 6,
  PENDING_REVIEW: 7,
  DRIVER_STATUS: 8,
  TOTAL: 8, // Total number of steps
} as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEPS)[keyof typeof ONBOARDING_STEPS];

// PASO 2: Tipo básico para recuperación de progreso
export interface OnboardingProgress {
  userId: string;
  currentStep: string;
  completedSteps: string[];
  lastSavedAt: Date;
}
