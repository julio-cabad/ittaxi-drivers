/**
 * Type definitions for image upload functionality
 */

export interface ImageUploadState {
  uri: string | null;
  downloadURL: string | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  isCompleted: boolean;
}

export interface DocumentsData {
  cedulaFrontal: ImageUploadState;
  cedulaPosterior: ImageUploadState;
  licenciaConducir: ImageUploadState;
  matriculaVehiculo: ImageUploadState;
  uploadedAt?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export interface VehiclePhotosData {
  frontal: ImageUploadState;
  posterior: ImageUploadState;
  lateralIzquierda: ImageUploadState;
  lateralDerecha: ImageUploadState;
  interior: ImageUploadState;
  uploadedAt?: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

export interface ImagePickerOptions {
  mediaType: 'photo';
  includeBase64: false;
  maxHeight: number;
  maxWidth: number;
  quality: number;
}

export interface ImagePickerResponse {
  didCancel?: boolean;
  errorMessage?: string;
  assets?: Array<{
    uri: string;
    type: string;
    fileName?: string;
    fileSize?: number;
    width?: number;
    height?: number;
  }>;
}

export interface ImageCompressionOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'JPEG' | 'PNG';
  keepMeta?: boolean;
}

export interface UploadError {
  code: string;
  message: string;
  retryable: boolean;
}

export const DEFAULT_IMAGE_PICKER_OPTIONS: ImagePickerOptions = {
  mediaType: 'photo',
  includeBase64: false,
  maxHeight: 2000,
  maxWidth: 2000,
  quality: 0.8,
};

export const DEFAULT_COMPRESSION_OPTIONS: ImageCompressionOptions = {
  width: 1024,
  height: 1024,
  quality: 80,
  format: 'JPEG',
  keepMeta: false,
};

export const createInitialImageUploadState = (): ImageUploadState => ({
  uri: null,
  downloadURL: null,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  isCompleted: false,
});

export const createInitialDocumentsData = (): DocumentsData => ({
  cedulaFrontal: createInitialImageUploadState(),
  cedulaPosterior: createInitialImageUploadState(),
  licenciaConducir: createInitialImageUploadState(),
  matriculaVehiculo: createInitialImageUploadState(),
  status: 'pending',
});

export const createInitialVehiclePhotosData = (): VehiclePhotosData => ({
  frontal: createInitialImageUploadState(),
  posterior: createInitialImageUploadState(),
  lateralIzquierda: createInitialImageUploadState(),
  lateralDerecha: createInitialImageUploadState(),
  interior: createInitialImageUploadState(),
  status: 'pending',
});