/**
 * Firebase Storage configuration and utilities
 */
import storage from '@react-native-firebase/storage';
import { DocumentType, VehiclePhotoType } from '../utils/imageValidation';


export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface UploadResult {
  downloadURL: string;
  fullPath: string;
  name: string;
}

export class FirebaseStorageService {
  private static instance: FirebaseStorageService;

  public static getInstance(): FirebaseStorageService {
    if (!FirebaseStorageService.instance) {
      FirebaseStorageService.instance = new FirebaseStorageService();
    }
    return FirebaseStorageService.instance;
  }

  /**
   * Uploads an image to Firebase Storage
   */
  async uploadImage(
    imageUri: string,
    storagePath: string,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<UploadResult> {
    try {
      const reference = storage().ref(storagePath);
      const task = reference.putFile(imageUri);

      // Set up progress listener
      if (onProgress) {
        task.on('state_changed', snapshot => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            ),
          };
          onProgress(progress);
        });
      }

      // Wait for upload to complete
      await task;

      // Get download URL
      const downloadURL = await reference.getDownloadURL();

      return {
        downloadURL,
        fullPath: reference.fullPath,
        name: reference.name,
      };
    } catch (error) {
      console.error('Error uploading image to Firebase Storage:', error);
      throw this.handleStorageError(error);
    }
  }

  /**
   * Deletes an image from Firebase Storage
   */
  async deleteImage(storagePath: string): Promise<void> {
    try {
      const reference = storage().ref(storagePath);
      await reference.delete();
    } catch (error) {
      console.error('Error deleting image from Firebase Storage:', error);
      throw this.handleStorageError(error);
    }
  }

  /**
   * Gets download URL for an existing file
   */
  async getDownloadURL(storagePath: string): Promise<string> {
    try {
      const reference = storage().ref(storagePath);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw this.handleStorageError(error);
    }
  }

  /**
   * Checks if a file exists in storage
   */
  async fileExists(storagePath: string): Promise<boolean> {
    try {
      const reference = storage().ref(storagePath);
      await reference.getDownloadURL();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets storage path for document upload
   */
  getDocumentPath(userId: string, documentType: DocumentType): string {
    const timestamp = Date.now();
    return `drivers/${userId}/documents/${documentType}-${timestamp}.jpg`;
  }

  /**
   * Gets storage path for vehicle photo upload
   */
  getVehiclePhotoPath(userId: string, photoType: VehiclePhotoType): string {
    const timestamp = Date.now();
    return `drivers/${userId}/vehicle-photos/${photoType}-${timestamp}.jpg`;
  }

  /**
   * Handles Firebase Storage errors and converts them to user-friendly messages
   */
  private handleStorageError(error: any): Error {
    let message = 'Error desconocido al subir la imagen';

    if (error.code) {
      switch (error.code) {
        case 'storage/unauthorized':
          message = 'No tienes permisos para subir esta imagen';
          break;
        case 'storage/canceled':
          message = 'La subida fue cancelada';
          break;
        case 'storage/unknown':
          message = 'Error desconocido. Por favor intenta nuevamente';
          break;
        case 'storage/object-not-found':
          message = 'El archivo no fue encontrado';
          break;
        case 'storage/bucket-not-found':
          message = 'Error de configuración del almacenamiento';
          break;
        case 'storage/project-not-found':
          message = 'Error de configuración del proyecto';
          break;
        case 'storage/quota-exceeded':
          message = 'Se ha excedido el límite de almacenamiento';
          break;
        case 'storage/unauthenticated':
          message = 'Debes iniciar sesión para subir imágenes';
          break;
        case 'storage/retry-limit-exceeded':
          message = 'Se agotaron los intentos. Verifica tu conexión';
          break;
        case 'storage/invalid-checksum':
          message = 'El archivo se corrompió durante la subida';
          break;
        case 'storage/canceled':
          message = 'La subida fue cancelada';
          break;
        default:
          message = `Error: ${error.message || 'Error desconocido'}`;
      }
    }

    return new Error(message);
  }
}

// Export singleton instance
export const firebaseStorageService = FirebaseStorageService.getInstance();

/**
 * Firebase Storage Security Rules (to be applied in Firebase Console)
 *
 * rules_version = '2';
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     // Allow users to upload and read their own driver documents and photos
 *     match /drivers/{userId}/{allPaths=**} {
 *       allow read, write: if request.auth != null
 *         && request.auth.uid == userId
 *         && resource.size < 5 * 1024 * 1024 // 5MB limit
 *         && resource.contentType.matches('image/.*'); // Only images
 *     }
 *   }
 * }
 */
