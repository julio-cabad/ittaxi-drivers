export interface ImageUploadState {
  uri: string | null;
  downloadURL: string | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  isCompleted: boolean;
}

// ImagePickerOptions and ImagePickerResponse are now imported from react-native-image-picker directly

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

// DEFAULT_IMAGE_PICKER_OPTIONS moved to useImagePicker hook

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