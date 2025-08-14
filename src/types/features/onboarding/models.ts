/**
 * Onboarding business logic models
 * Core data structures for the onboarding process
 */

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
  emergencyContact: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  vin: string;
  vehicleType: VehicleType;
  seats: number;
  hasAirConditioning: boolean;
  hasGPS: boolean;
}

export type VehicleType = 'sedan' | 'suv' | 'hatchback' | 'pickup';

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
  uploadUrl?: string;
  uploadStatus: UploadStatus;
  uploadProgress?: number;
}

export interface PhotoFile {
  id: string;
  name: string;
  uri: string;
  type: PhotoType;
  uploadUrl?: string;
  uploadStatus: UploadStatus;
  uploadProgress?: number;
}

export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'error';
export type PhotoType = 'vehicle_front' | 'vehicle_back' | 'vehicle_interior' | 'profile_photo';

export interface DocumentsData {
  driverLicense: DocumentFile | null;
  vehicleRegistration: DocumentFile | null;
  insurance: DocumentFile | null;
  nationalId: DocumentFile | null;
  criminalRecord: DocumentFile | null;
}

export interface PhotosData {
  vehicleFront: PhotoFile | null;
  vehicleBack: PhotoFile | null;
  vehicleInterior: PhotoFile | null;
  profilePhoto: PhotoFile | null;
}

export interface OnboardingUserData {
  personal: PersonalData | null;
  vehicle: VehicleData | null;
  documents: DocumentsData | null;
  photos: PhotosData | null;
}

export interface OnboardingStatus {
  status: OnboardingStatusType;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  requiredChanges?: string[];
  estimatedReviewTime?: number; // hours
}

export type OnboardingStatusType = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'requires_changes';

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
} as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[keyof typeof ONBOARDING_STEPS];

// StepCompletionTimes and StepValidation moved to shared.ts to avoid circular dependencies