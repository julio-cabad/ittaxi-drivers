/**
 * Hook for uploading images to Firebase Storage with progress tracking and retry logic
 */
import { useState, useCallback, useRef } from 'react';
import { firebaseStorageService, type UploadProgress, type UploadResult } from '../config/firebaseStorage';
import type { UploadError } from '../types/onboarding';

export interface UseImageUploadReturn {
  uploadImage: (imageUri: string, storagePath: string) => Promise<string>;
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
  resetUpload: () => void;
  cancelUpload: () => void;
}

interface UploadTask {
  cancel: () => void;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_BASE = 1000; // 1 second

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUploadTask = useRef<UploadTask | null>(null);
  const isCancelled = useRef(false);

  /**
   * Resets upload state
   */
  const resetUpload = useCallback(() => {
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
    isCancelled.current = false;
    currentUploadTask.current = null;
  }, []);

  /**
   * Cancels current upload
   */
  const cancelUpload = useCallback(() => {
    if (currentUploadTask.current) {
      currentUploadTask.current.cancel();
      currentUploadTask.current = null;
    }
    isCancelled.current = true;
    setIsUploading(false);
    setError('Subida cancelada');
  }, []);

  /**
   * Determines if an error is retryable
   */
  const isRetryableError = useCallback((uploadError: any): boolean => {
    if (!uploadError?.code) return false;

    const retryableCodes = [
      'storage/retry-limit-exceeded',
      'storage/unknown',
      'storage/canceled', // Network issues
    ];

    return retryableCodes.includes(uploadError.code);
  }, []);

  /**
   * Creates delay for retry attempts with exponential backoff
   */
  const createRetryDelay = useCallback((attempt: number): Promise<void> => {
    const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1);
    return new Promise(resolve => setTimeout(resolve, delay));
  }, []);

  /**
   * Handles upload progress updates
   */
  const handleProgressUpdate = useCallback((progress: UploadProgress) => {
    if (!isCancelled.current) {
      setUploadProgress(progress.progress);
    }
  }, []);

  /**
   * Uploads image with retry logic
   */
  const uploadWithRetry = useCallback(async (
    imageUri: string,
    storagePath: string,
    attempt: number = 1
  ): Promise<UploadResult> => {
    try {
      if (isCancelled.current) {
        throw new Error('Upload was cancelled');
      }

      console.log(`🔄 Upload attempt ${attempt} for ${storagePath}`);

      const result = await firebaseStorageService.uploadImage(
        imageUri,
        storagePath,
        handleProgressUpdate
      );

      console.log(`✅ Upload successful on attempt ${attempt}`);
      return result;
    } catch (uploadError: any) {
      console.error(`❌ Upload attempt ${attempt} failed:`, uploadError);

      // If cancelled, don't retry
      if (isCancelled.current) {
        throw new Error('Upload was cancelled');
      }

      // If max attempts reached, throw error
      if (attempt >= MAX_RETRY_ATTEMPTS) {
        throw uploadError;
      }

      // If error is not retryable, throw immediately
      if (!isRetryableError(uploadError)) {
        throw uploadError;
      }

      // Wait before retry with exponential backoff
      await createRetryDelay(attempt);

      // Retry
      return uploadWithRetry(imageUri, storagePath, attempt + 1);
    }
  }, [handleProgressUpdate, isRetryableError, createRetryDelay]);

  /**
   * Main upload function
   */
  const uploadImage = useCallback(async (
    imageUri: string,
    storagePath: string
  ): Promise<string> => {
    // Reset state
    setError(null);
    setUploadProgress(0);
    setIsUploading(true);
    isCancelled.current = false;

    try {
      console.log(`🚀 Starting upload: ${imageUri} -> ${storagePath}`);

      // Create a mock cancel function for the upload task
      // In a real implementation, this would be connected to Firebase's task cancellation
      currentUploadTask.current = {
        cancel: () => {
          console.log('🛑 Upload task cancelled');
          isCancelled.current = true;
        }
      };

      const result = await uploadWithRetry(imageUri, storagePath);

      if (isCancelled.current) {
        throw new Error('Upload was cancelled');
      }

      console.log(`✅ Upload completed successfully: ${result.downloadURL}`);
      setUploadProgress(100);
      return result.downloadURL;

    } catch (uploadError: any) {
      console.error('❌ Upload failed:', uploadError);

      if (isCancelled.current) {
        setError('Subida cancelada');
      } else {
        // Convert Firebase error to user-friendly message
        const errorMessage = uploadError.message || 'Error desconocido al subir la imagen';
        setError(errorMessage);
      }

      throw uploadError;
    } finally {
      setIsUploading(false);
      currentUploadTask.current = null;
    }
  }, [uploadWithRetry]);

  return {
    uploadImage,
    uploadProgress,
    isUploading,
    error,
    resetUpload,
    cancelUpload,
  };
};