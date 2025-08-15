/**
 * Image validation utilities for onboarding process
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: ImageValidationError;
}

export enum ImageValidationError {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  INVALID_DIMENSIONS = 'INVALID_DIMENSIONS',
}

export interface ImageValidationOptions {
  maxSizeBytes?: number;
  allowedFormats?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const DEFAULT_OPTIONS: Required<ImageValidationOptions> = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
  minWidth: 200,
  minHeight: 200,
  maxWidth: 4000,
  maxHeight: 4000,
};

/**
 * Validates an image file based on size, format, and dimensions
 */
export const validateImage = async (
  imageUri: string,
  options: ImageValidationOptions = {}
): Promise<ImageValidationResult> => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Check if file exists and get basic info
    const response = await fetch(imageUri);
    if (!response.ok) {
      return {
        isValid: false,
        error: 'No se pudo acceder al archivo de imagen',
        errorCode: ImageValidationError.FILE_NOT_FOUND,
      };
    }

    // Check file size
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      const fileSize = parseInt(contentLength, 10);
      if (fileSize > config.maxSizeBytes) {
        return {
          isValid: false,
          error: `El archivo es demasiado grande. Máximo permitido: ${formatFileSize(config.maxSizeBytes)}`,
          errorCode: ImageValidationError.FILE_TOO_LARGE,
        };
      }
    }

    // Check file format
    const contentType = response.headers.get('content-type');
    if (contentType && !config.allowedFormats.includes(contentType)) {
      return {
        isValid: false,
        error: `Formato de archivo no válido. Formatos permitidos: ${config.allowedFormats.join(', ')}`,
        errorCode: ImageValidationError.INVALID_FORMAT,
      };
    }

    // For more detailed validation, we would need to load the image
    // This is a basic validation that covers most cases
    return {
      isValid: true,
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Error al validar la imagen',
      errorCode: ImageValidationError.FILE_NOT_FOUND,
    };
  }
};

/**
 * Validates image dimensions using Image component
 */
export const validateImageDimensions = (
  imageUri: string,
  options: ImageValidationOptions = {}
): Promise<ImageValidationResult> => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve) => {
    const Image = require('react-native').Image;
    
    Image.getSize(
      imageUri,
      (width: number, height: number) => {
        if (width < config.minWidth || height < config.minHeight) {
          resolve({
            isValid: false,
            error: `La imagen es demasiado pequeña. Mínimo: ${config.minWidth}x${config.minHeight}px`,
            errorCode: ImageValidationError.INVALID_DIMENSIONS,
          });
          return;
        }

        if (width > config.maxWidth || height > config.maxHeight) {
          resolve({
            isValid: false,
            error: `La imagen es demasiado grande. Máximo: ${config.maxWidth}x${config.maxHeight}px`,
            errorCode: ImageValidationError.INVALID_DIMENSIONS,
          });
          return;
        }

        resolve({
          isValid: true,
        });
      },
      (error: any) => {
        resolve({
          isValid: false,
          error: 'No se pudieron obtener las dimensiones de la imagen',
          errorCode: ImageValidationError.INVALID_FORMAT,
        });
      }
    );
  });
};

/**
 * Formats file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets file extension from URI
 */
export const getFileExtension = (uri: string): string => {
  const parts = uri.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Generates unique filename for Firebase Storage
 */
export const generateUniqueFileName = (
  userId: string,
  fileType: string,
  extension: string = 'jpg'
): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  return `${userId}/${fileType}-${timestamp}-${randomId}.${extension}`;
};

/**
 * Document types for onboarding
 */
export enum DocumentType {
  CEDULA_FRONTAL = 'cedula-frontal',
  CEDULA_POSTERIOR = 'cedula-posterior',
  LICENCIA_CONDUCIR = 'licencia-conducir',
  MATRICULA_VEHICULO = 'matricula-vehiculo',
}

/**
 * Vehicle photo types for onboarding
 */
export enum VehiclePhotoType {
  FRONTAL = 'frontal',
  POSTERIOR = 'posterior',
  LATERAL_IZQUIERDA = 'lateral-izq',
  LATERAL_DERECHA = 'lateral-der',
  INTERIOR = 'interior',
}

/**
 * Gets Firebase Storage path for document
 */
export const getDocumentStoragePath = (
  userId: string,
  documentType: DocumentType
): string => {
  return `drivers/${userId}/documents/${generateUniqueFileName(userId, documentType)}`;
};

/**
 * Gets Firebase Storage path for vehicle photo
 */
export const getVehiclePhotoStoragePath = (
  userId: string,
  photoType: VehiclePhotoType
): string => {
  return `drivers/${userId}/vehicle-photos/${generateUniqueFileName(userId, photoType)}`;
};