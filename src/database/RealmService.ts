import Realm from 'realm';
import {
  OnboardingData,
  DocumentFile,
  PhotoFile,
} from './schemas/OnboardingSchema';
import {
  OnboardingState,
  PersonalData,
  VehicleData,
  DocumentsData,
  PhotosData,
} from '../types/onboarding';

class RealmService {
  private realm: Realm | null = null;

  async initialize(): Promise<void> {
    try {
      this.realm = await Realm.open({
        schema: [OnboardingData, DocumentFile, PhotoFile],
        schemaVersion: 1,
        onMigration: (_oldRealm: Realm, _newRealm: Realm) => {
          // Handle migrations here if needed
        },
      });

    } catch (error) {
      console.error('Error initializing Realm:', error);
      throw error;
    }
  }

  private ensureRealm(): Realm {
    if (!this.realm) {
      throw new Error('Realm not initialized. Call initialize() first.');
    }
    return this.realm;
  }

  // Onboarding Data Methods
  async saveOnboardingData(
    userId: string,
    data: Partial<OnboardingState>,
  ): Promise<void> {
    const realm = this.ensureRealm();

    try {
      realm.write(() => {
        const existing = realm.objectForPrimaryKey<OnboardingData>(
          'OnboardingData',
          userId,
        );

        if (existing) {
          existing.userId = userId;
          existing.currentStep = data.currentStep || 1;
          existing.totalSteps = data.totalSteps || 8;
          existing.isCompleted = data.isCompleted || false;
          existing.progress = data.progress || 0;
          existing.personalData = data.userData?.personal
            ? JSON.stringify(data.userData.personal)
            : existing.personalData;
          existing.vehicleData = data.userData?.vehicle
            ? JSON.stringify(data.userData.vehicle)
            : existing.vehicleData;
          existing.documentsData = data.userData?.documents
            ? JSON.stringify(data.userData.documents)
            : existing.documentsData;
          existing.photosData = data.userData?.photos
            ? JSON.stringify(data.userData.photos)
            : existing.photosData;
          existing.lastSavedAt = new Date();
          existing.syncStatus = data.syncStatus || 'pending';
          existing.stepValidation = data.stepValidation
            ? JSON.stringify(data.stepValidation)
            : existing.stepValidation;
        } else {
          const newOnboardingData: OnboardingData = {
            _id: userId,
            userId,
            currentStep: data.currentStep || 1,
            totalSteps: data.totalSteps || 8,
            isCompleted: data.isCompleted || false,
            progress: data.progress || 0,
            personalData: data.userData?.personal
              ? JSON.stringify(data.userData.personal)
              : undefined,
            vehicleData: data.userData?.vehicle
              ? JSON.stringify(data.userData.vehicle)
              : undefined,
            documentsData: data.userData?.documents
              ? JSON.stringify(data.userData.documents)
              : undefined,
            photosData: data.userData?.photos
              ? JSON.stringify(data.userData.photos)
              : undefined,
            lastSavedAt: new Date(),
            syncStatus: data.syncStatus || 'pending',
            stepValidation: data.stepValidation
              ? JSON.stringify(data.stepValidation)
              : undefined,
          } as OnboardingData;

          realm.create('OnboardingData', newOnboardingData);
        }
      });
    } catch (error) {
      console.error('Error saving onboarding data to Realm:', error);
      throw error;
    }
  }

  async getOnboardingData(
    userId: string,
  ): Promise<Partial<OnboardingState> | null> {
    const realm = this.ensureRealm();

    try {
      const data = realm.objectForPrimaryKey<OnboardingData>(
        'OnboardingData',
        userId,
      );

      if (!data) {
        return null;
      }

      const result: Partial<OnboardingState> = {
        currentStep: data.currentStep,
        totalSteps: data.totalSteps,
        isCompleted: data.isCompleted,
        progress: data.progress,
        userId: data.userId,
        userData: {
          personal: data.personalData
            ? (JSON.parse(data.personalData) as PersonalData)
            : null,
          vehicle: data.vehicleData
            ? (JSON.parse(data.vehicleData) as VehicleData)
            : null,
          documents: data.documentsData
            ? (JSON.parse(data.documentsData) as DocumentsData)
            : null,
          photos: data.photosData
            ? (JSON.parse(data.photosData) as PhotosData)
            : null,
        },
        lastSavedAt: data.lastSavedAt.toISOString(),
        syncStatus: data.syncStatus as OnboardingState['syncStatus'],
        stepValidation: data.stepValidation
          ? JSON.parse(data.stepValidation)
          : {},
      };

      return result;
    } catch (error) {
      console.error('Error getting onboarding data from Realm:', error);
      throw error;
    }
  }

  async deleteOnboardingData(userId: string): Promise<void> {
    const realm = this.ensureRealm();

    try {
      realm.write(() => {
        const data = realm.objectForPrimaryKey('OnboardingData', userId);
        if (data) {
          realm.delete(data);
        }
      });
    } catch (error) {
      console.error('Error deleting onboarding data from Realm:', error);
      throw error;
    }
  }

  // Document File Methods
  async saveDocumentFile(
    userId: string,
    documentType: string,
    fileData: any,
  ): Promise<void> {
    const realm = this.ensureRealm();

    try {
      realm.write(() => {
        const documentFile: DocumentFile = {
          _id: `${userId}_${documentType}`,
          userId,
          documentType,
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          uri: fileData.uri,
          uploadUrl: fileData.uploadUrl,
          uploadStatus: fileData.uploadStatus || 'pending',
          uploadProgress: fileData.uploadProgress || 0,
          createdAt: new Date(),
        } as DocumentFile;

        realm.create('DocumentFile', documentFile, Realm.UpdateMode.Modified);
      });
    } catch (error) {
      console.error('Error saving document file to Realm:', error);
      throw error;
    }
  }

  async getDocumentFiles(userId: string): Promise<DocumentFile[]> {
    const realm = this.ensureRealm();

    try {
      const files = realm
        .objects<DocumentFile>('DocumentFile')
        .filtered('userId == $0', userId);
      return Array.from(files);
    } catch (error) {
      console.error('Error getting document files from Realm:', error);
      throw error;
    }
  }

  // Photo File Methods
  async savePhotoFile(
    userId: string,
    photoType: string,
    fileData: any,
  ): Promise<void> {
    const realm = this.ensureRealm();

    try {
      realm.write(() => {
        const photoFile: PhotoFile = {
          _id: `${userId}_${photoType}`,
          userId,
          photoType,
          name: fileData.name,
          uri: fileData.uri,
          uploadUrl: fileData.uploadUrl,
          uploadStatus: fileData.uploadStatus || 'pending',
          uploadProgress: fileData.uploadProgress || 0,
          createdAt: new Date(),
        } as PhotoFile;

        realm.create('PhotoFile', photoFile, Realm.UpdateMode.Modified);
      });
    } catch (error) {
      console.error('Error saving photo file to Realm:', error);
      throw error;
    }
  }

  async getPhotoFiles(userId: string): Promise<PhotoFile[]> {
    const realm = this.ensureRealm();

    try {
      const files = realm
        .objects<PhotoFile>('PhotoFile')
        .filtered('userId == $0', userId);
      return Array.from(files);
    } catch (error) {
      console.error('Error getting photo files from Realm:', error);
      throw error;
    }
  }

  // Utility Methods
  async getAllPendingSyncData(): Promise<OnboardingData[]> {
    const realm = this.ensureRealm();

    try {
      const pendingData = realm
        .objects<OnboardingData>('OnboardingData')
        .filtered('syncStatus == "pending"');
      return Array.from(pendingData);
    } catch (error) {
      console.error('Error getting pending sync data from Realm:', error);
      throw error;
    }
  }

  async markAsSynced(userId: string): Promise<void> {
    const realm = this.ensureRealm();

    try {
      realm.write(() => {
        const data = realm.objectForPrimaryKey<OnboardingData>(
          'OnboardingData',
          userId,
        );
        if (data) {
          data.syncStatus = 'synced';
          data.lastSavedAt = new Date();
        }
      });
    } catch (error) {
      console.error('Error marking data as synced in Realm:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
      this.realm = null;
    }
  }
}

export const realmService = new RealmService();
