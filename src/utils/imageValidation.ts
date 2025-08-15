/**
 * Image validation utilities for onboarding process
 */
import { strings } from '../constants/strings';

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
  options: ImageValidationOptions = {},
): Promise<ImageValidationResult> => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Check if file exists and get basic info
    const response = await fetch(imageUri);
    if (!response.ok) {
      return {
        isValid: false,
        error: strings.imageUpload.validation.fileNotFound,
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
          error: `${strings.imageUpload.validation.fileTooLarge}. Máximo permitido: ${formatFileSize(
            config.maxSizeBytes,
          )}`,
          errorCode: ImageValidationError.FILE_TOO_LARGE,
        };
      }
    }

    // Check file format
    const contentType = response.headers.get('content-type');
    if (contentType && !config.allowedFormats.includes(contentType)) {
      return {
        isValid: false,
        error: `${strings.imageUpload.validation.invalidFormat}. Formatos permitidos: ${config.allowedFormats.join(
          ', ',
        )}`,
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
      error: strings.imageUpload.errors.validating,
      errorCode: ImageValidationError.FILE_NOT_FOUND,
    };
  }
};

/**
 * Validates image dimensions using Image component
 */
export const validateImageDimensions = (
  imageUri: string,
  options: ImageValidationOptions = {},
): Promise<ImageValidationResult> => {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return new Promise(resolve => {
    const Image = require('react-native').Image;

    Image.getSize(
      imageUri,
      (width: number, height: number) => {
        if (width < config.minWidth || height < config.minHeight) {
          resolve({
            isValid: false,
            error: `${strings.imageUpload.validation.invalidDimensions}. Mínimo: ${config.minWidth}x${config.minHeight}px`,
            errorCode: ImageValidationError.INVALID_DIMENSIONS,
          });
          return;
        }

        if (width > config.maxWidth || height > config.maxHeight) {
          resolve({
            isValid: false,
            error: `${strings.imageUpload.validation.invalidDimensions}. Máximo: ${config.maxWidth}x${config.maxHeight}px`,
            errorCode: ImageValidationError.INVALID_DIMENSIONS,
          });
          return;
        }

        resolve({
          isValid: true,
        });
      },
      (_error: any) => {
        resolve({
          isValid: false,
          error: strings.imageUpload.validation.invalidDimensions,
          errorCode: ImageValidationError.INVALID_FORMAT,
        });
      },
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
  extension: string = 'jpg',
): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  return `${userId}/${fileType}-${timestamp}-${randomId}.${extension}`;
};

/**
 * Document types for onboarding - matches DocumentsData keys
 */
export enum DocumentType {
  NATIONAL_ID_FRONT = 'nationalIdFront',
  NATIONAL_ID_BACK = 'nationalIdBack',
  DRIVER_LICENSE = 'driverLicense',
  VEHICLE_REGISTRATION = 'vehicleRegistration',
}

/**
 * Vehicle photo types for onboarding - matches PhotosData keys
 */
export enum VehiclePhotoType {
  FRONT = 'front',
  BACK = 'back',
  LEFT_SIDE = 'leftSide',
  RIGHT_SIDE = 'rightSide',
  INTERIOR = 'interior',
}

/**
 * Gets Firebase Storage path for document
 */
export const getDocumentStoragePath = (
  userId: string,
  documentType: DocumentType,
): string => {
  return `drivers/${userId}/documents/${generateUniqueFileName(
    userId,
    documentType,
  )}`;
};

/**
 * Gets Firebase Storage path for vehicle photo
 */
export const getVehiclePhotoStoragePath = (
  userId: string,
  photoType: VehiclePhotoType,
): string => {
  return `drivers/${userId}/vehicle-photos/${generateUniqueFileName(
    userId,
    photoType,
  )}`;
};
