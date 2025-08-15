import { firebaseService, FirebaseUploadProgress } from './FirebaseService';
import { realmService } from '../database/RealmService';
import {
  OnboardingState,
  OnboardingStatus,
  DocumentsData,
  PhotosData,
  DocumentFile,
  PhotoFile,
} from '../types/onboarding';
import { OnboardingToasts, NetworkToasts } from '../utils/toastUtils';
import { DateUtils } from '../utils/dateUtils';

class OnboardingService {
  private readonly COLLECTIONS = {
    ONBOARDING: 'onboarding',
    ONBOARDING_STATUS: 'onboarding_status',
    USERS: 'users',
  };

  private readonly STORAGE_PATHS = {
    DOCUMENTS: 'onboarding/documents',
    PHOTOS: 'onboarding/photos',
  };

  // Data Operations
  async getOnboardingData(
    userId: string,
  ): Promise<Partial<OnboardingState> | null> {
    try {
      // First try to get from local Realm
      const localData = await realmService.getOnboardingData(userId);

      if (localData) {
        return localData;
      }

      // If not in local, get from Firestore
      const doc = await firebaseService.getDocument(
        this.COLLECTIONS.ONBOARDING,
        userId,
      );

      if (doc?.exists && doc.data) {
        // Save to local Realm for future use
        await realmService.saveOnboardingData(userId, doc.data);
        return doc.data;
      }

      return null;
    } catch (error) {
      console.error('Error getting onboarding data:', error);
      // Try to get from local if Firestore fails
      return await realmService.getOnboardingData(userId);
    }
  }

  async saveOnboardingData(
    userId: string,
    data: Partial<OnboardingState>,
  ): Promise<void> {
    try {
      // Save to local Realm first (fast)
      await realmService.saveOnboardingData(userId, {
        ...data,
        syncStatus: 'pending',
      });

      // Then sync to Firestore (background)
      await firebaseService.setDocument(
        this.COLLECTIONS.ONBOARDING,
        userId,
        data,
      );

      // Mark as synced in Realm
      await realmService.markAsSynced(userId);

      OnboardingToasts.dataSaved();
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      OnboardingToasts.syncError();
      throw error;
    }
  }

  async updateStep(userId: string, step: number, stepData: any): Promise<void> {
    try {
      const updateData = {
        [`step${step}Data`]: stepData,
        currentStep: step,
        progress: Math.round((step / 8) * 100),
        lastUpdated: firebaseService.getServerTimestamp(),
      };

      await this.saveOnboardingData(userId, updateData);

      const stepNames = {
        1: 'Registro',
        2: 'Datos Personales',
        3: 'Datos del Vehículo',
        4: 'Fotos del Vehículo',
        5: 'Documentos',
        6: 'Revisión',
        7: 'Enviado',
        8: 'Completado',
      };

      OnboardingToasts.stepCompleted(
        stepNames[step as keyof typeof stepNames] || `Paso ${step}`,
      );
    } catch (error) {
      console.error('Error updating step:', error);
      throw error;
    }
  }

  // Status Operations
  async getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
    try {
      const doc = await firebaseService.getDocument(
        this.COLLECTIONS.ONBOARDING_STATUS,
        userId,
      );

      if (doc?.exists && doc.data) {
        return doc.data as OnboardingStatus;
      }

      // Default status for new users
      return {
        status: 'draft',
        estimatedReviewTime: 24,
      };
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      throw error;
    }
  }

  async updateOnboardingStatus(
    userId: string,
    status: Partial<OnboardingStatus>,
  ): Promise<void> {
    try {
      await firebaseService.setDocument(
        this.COLLECTIONS.ONBOARDING_STATUS,
        userId,
        status,
      );

      if (status.status) {
        const statusMessages = {
          submitted: 'enviada para revisión',
          under_review: 'siendo revisada',
          approved: 'aprobada',
          rejected: 'rechazada',
          requires_changes: 'requiere cambios',
        };

        const message =
          statusMessages[status.status as keyof typeof statusMessages];
        if (message) {
          OnboardingToasts.statusUpdate(message);
        }
      }
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      throw error;
    }
  }

  // Helper method to convert PhotosData keys to PhotoFile.type values
  private mapPhotoTypeToFileType(
    photoType: keyof PhotosData,
  ): PhotoFile['type'] {
    const mapping: Record<keyof PhotosData, PhotoFile['type']> = {
      front: 'frontal',
      back: 'posterior',
      leftSide: 'lateral_izquierda',
      rightSide: 'lateral_derecha',
      interior: 'interior',
    };
    return mapping[photoType];
  }

  // File Upload Operations
  async uploadDocument(
    userId: string,
    documentType: keyof DocumentsData,
    file: { uri: string; name: string; type: string; size: number },
    onProgress?: (progress: FirebaseUploadProgress) => void,
  ): Promise<DocumentFile> {
    try {
      OnboardingToasts.uploadProgress(file.name);

      const path = `${
        this.STORAGE_PATHS.DOCUMENTS
      }/${userId}/${documentType}_${Date.now()}`;
      const uploadResult = await firebaseService.uploadFile(
        path,
        file.uri,
        onProgress,
      );

      const documentFile: DocumentFile = {
        id: uploadResult.name,
        name: file.name,
        type: file.type,
        size: file.size,
        uri: file.uri,
        uploadUrl: uploadResult.downloadURL,
        uploadStatus: 'completed',
        uploadProgress: 100,
      };

      // Save to local Realm
      await realmService.saveDocumentFile(userId, documentType, documentFile);

      // Update Firestore
      await firebaseService.updateDocument(
        this.COLLECTIONS.ONBOARDING,
        userId,
        {
          [`documentsData.${documentType}`]: documentFile,
        },
      );

      OnboardingToasts.uploadSuccess(file.name);
      return documentFile;
    } catch (error) {
      console.error('Error uploading document:', error);
      OnboardingToasts.uploadError(file.name);
      throw error;
    }
  }

  async uploadPhoto(
    userId: string,
    photoType: keyof PhotosData,
    file: { uri: string; name: string },
    onProgress?: (progress: FirebaseUploadProgress) => void,
  ): Promise<PhotoFile> {
    try {
      OnboardingToasts.uploadProgress(file.name);

      const path = `${
        this.STORAGE_PATHS.PHOTOS
      }/${userId}/${photoType}_${Date.now()}`;
      const uploadResult = await firebaseService.uploadFile(
        path,
        file.uri,
        onProgress,
      );

      const photoFile: PhotoFile = {
        id: uploadResult.name,
        name: file.name,
        uri: file.uri,
        type: this.mapPhotoTypeToFileType(photoType),
        uploadUrl: uploadResult.downloadURL,
        uploadStatus: 'completed',
        uploadProgress: 100,
      };

      // Save to local Realm
      await realmService.savePhotoFile(userId, photoType, photoFile);

      // Update Firestore
      await firebaseService.updateDocument(
        this.COLLECTIONS.ONBOARDING,
        userId,
        {
          [`photosData.${photoType}`]: photoFile,
        },
      );

      OnboardingToasts.uploadSuccess(file.name);
      return photoFile;
    } catch (error) {
      console.error('Error uploading photo:', error);
      OnboardingToasts.uploadError(file.name);
      throw error;
    }
  }

  // Submission
  async submitOnboarding(userId: string): Promise<void> {
    try {
      // Validate all required data is present
      const onboardingData = await this.getOnboardingData(userId);

      if (!this.validateOnboardingComplete(onboardingData)) {
        throw new Error('Onboarding data is incomplete');
      }

      // Update status to submitted
      await this.updateOnboardingStatus(userId, {
        status: 'submitted',
        submittedAt: DateUtils.now(),
        estimatedReviewTime: 24,
      });

      // Mark onboarding as completed
      await this.saveOnboardingData(userId, {
        isCompleted: true,
        completedAt: DateUtils.now(),
      });

      OnboardingToasts.submissionSuccess();
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      OnboardingToasts.submissionError();
      throw error;
    }
  }

  // Real-time subscriptions
  subscribeToStatus(
    userId: string,
    callback: (status: OnboardingStatus) => void,
  ): () => void {
    return firebaseService.subscribeToDocument(
      this.COLLECTIONS.ONBOARDING_STATUS,
      userId,
      doc => {
        if (doc?.exists && doc.data) {
          callback(doc.data as OnboardingStatus);
        }
      },
      error => {
        console.error('Error in status subscription:', error);
        NetworkToasts.connectionLost();
      },
    );
  }

  // Sync operations
  async syncPendingData(): Promise<void> {
    try {
      const pendingData = await realmService.getAllPendingSyncData();

      for (const data of pendingData) {
        try {
          const onboardingData = {
            currentStep: data.currentStep,
            totalSteps: data.totalSteps,
            isCompleted: data.isCompleted,
            progress: data.progress,
            userData: {
              personal: data.personalData
                ? JSON.parse(data.personalData)
                : null,
              vehicle: data.vehicleData ? JSON.parse(data.vehicleData) : null,
              documents: data.documentsData
                ? JSON.parse(data.documentsData)
                : null,
              photos: data.photosData ? JSON.parse(data.photosData) : null,
            },
          };

          await firebaseService.setDocument(
            this.COLLECTIONS.ONBOARDING,
            data.userId,
            onboardingData,
          );

          await realmService.markAsSynced(data.userId);
        } catch (error) {
          console.error(`Error syncing data for user ${data.userId}:`, error);
        }
      }

      if (pendingData.length > 0) {
        NetworkToasts.connectionRestored();
      }
    } catch (error) {
      console.error('Error syncing pending data:', error);
    }
  }

  // Validation
  private validateOnboardingComplete(
    data: Partial<OnboardingState> | null,
  ): boolean {
    if (!data?.userData) return false;

    const { personal, vehicle, documents, photos } = data.userData;

    // Check personal data
    if (!personal?.firstName || !personal?.lastName || !personal?.email) {
      OnboardingToasts.validationError('Faltan datos personales');
      return false;
    }

    // Check vehicle data
    if (!vehicle?.make || !vehicle?.model || !vehicle?.licensePlate) {
      OnboardingToasts.validationError('Faltan datos del vehículo');
      return false;
    }

    // Check required documents
    const requiredDocs: (keyof DocumentsData)[] = [
      'nationalIdFront',
      'nationalIdBack',
      'driverLicense',
      'vehicleRegistration',
    ];
    for (const docType of requiredDocs) {
      if (!documents?.[docType]?.uploadUrl) {
        OnboardingToasts.documentRequired(docType);
        return false;
      }
    }

    // Check required photos
    const requiredPhotos: (keyof PhotosData)[] = [
      'front',
      'back',
      'leftSide',
      'rightSide',
      'interior',
    ];
    for (const photoType of requiredPhotos) {
      if (!photos?.[photoType]?.uploadUrl) {
        OnboardingToasts.photoRequired(photoType);
        return false;
      }
    }

    return true;
  }
}

export const onboardingService = new OnboardingService();
