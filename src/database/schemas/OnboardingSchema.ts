import Realm from 'realm';

export class OnboardingData extends Realm.Object<OnboardingData> {
  _id!: string;
  userId!: string;
  currentStep!: number;
  totalSteps!: number;
  isCompleted!: boolean;
  progress!: number;
  
  // JSON strings for complex data
  personalData?: string;
  vehicleData?: string;
  documentsData?: string;
  photosData?: string;
  
  // Sync tracking
  lastSavedAt!: Date;
  syncStatus!: string; // 'synced' | 'pending' | 'error' | 'offline'
  
  // Validation
  stepValidation?: string; // JSON string of validation object
  
  static schema: Realm.ObjectSchema = {
    name: 'OnboardingData',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      userId: 'string',
      currentStep: 'int',
      totalSteps: 'int',
      isCompleted: 'bool',
      progress: 'int',
      personalData: 'string?',
      vehicleData: 'string?',
      documentsData: 'string?',
      photosData: 'string?',
      lastSavedAt: 'date',
      syncStatus: 'string',
      stepValidation: 'string?',
    },
  };
}

export class DocumentFile extends Realm.Object<DocumentFile> {
  _id!: string;
  userId!: string;
  documentType!: string;
  name!: string;
  type!: string;
  size!: number;
  uri!: string;
  uploadUrl?: string;
  uploadStatus!: string;
  uploadProgress?: number;
  createdAt!: Date;
  
  static schema: Realm.ObjectSchema = {
    name: 'DocumentFile',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      userId: 'string',
      documentType: 'string',
      name: 'string',
      type: 'string',
      size: 'int',
      uri: 'string',
      uploadUrl: 'string?',
      uploadStatus: 'string',
      uploadProgress: 'int?',
      createdAt: 'date',
    },
  };
}

export class PhotoFile extends Realm.Object<PhotoFile> {
  _id!: string;
  userId!: string;
  photoType!: string;
  name!: string;
  uri!: string;
  uploadUrl?: string;
  uploadStatus!: string;
  uploadProgress?: number;
  createdAt!: Date;
  
  static schema: Realm.ObjectSchema = {
    name: 'PhotoFile',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      userId: 'string',
      photoType: 'string',
      name: 'string',
      uri: 'string',
      uploadUrl: 'string?',
      uploadStatus: 'string',
      uploadProgress: 'int?',
      createdAt: 'date',
    },
  };
}